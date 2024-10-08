import { Ctx, Hears, InjectBot, Message, On, Start, Update } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { actionButtons } from './actions/app.buttons';
import { editActions, mainActions } from '@consts/actions';
import { TelegrafContext } from 'models/context.model';
import { showList } from '@utils/show-list';
import { editButtons } from 'actions/app.edit-buttons';
import { SubjectService } from '@api/subject/subject.service';

@Update()
export class AppUpdate {
  constructor(
    private readonly subjectService: SubjectService,
    @InjectBot() private readonly bot: Telegraf<TelegrafContext>,
  ) {}

  @Start()
  async startCommand(ctx: TelegrafContext) {
    await ctx.reply('Привет, неужели сделал лабу?)');
    await ctx.reply('Что ты хочешь от меня?', actionButtons());
    ctx.session.editType = undefined;
    ctx.session.type = undefined;
  }
  @Hears(mainActions.list)
  async getAll(ctx: TelegrafContext) {
    ctx.session.editType = undefined;
    const subjects = await this.subjectService.findAll();
    const message = subjects.length ? showList(subjects) : 'Список пуст';
    await ctx.reply(message);
  }
  @Hears(mainActions.add)
  async addItem(ctx: TelegrafContext) {
    ctx.session.editType = undefined;
    ctx.session.type = 'add';
    await ctx.reply(
      `Введите данные  для добавления через пробел в виде: Название_предмета вариант(если нет то пиши '-') сдано_лаб всего_лаб`,
    );
  }
  @Hears(mainActions.edit)
  async editItem(ctx: TelegrafContext) {
    ctx.session.editType = undefined;
    ctx.session.type = 'edit';
    const subjects = await this.subjectService.findAll();
    await ctx.reply(`Выбери предмет для обновления:\n${subjects.map((subject) => subject.name).join('\n')}`);
  }
  @Hears(mainActions.delete)
  async deleteItem(ctx: TelegrafContext) {
    ctx.session.editType = undefined;
    ctx.session.type = 'delete';
    const subjects = await this.subjectService.findAll();
    await ctx.reply(`Выбери предмет для удаления:\n${subjects.map((subject) => subject.name).join('\n')}`);
  }

  //--------------------------------------------------------------S
  @Hears(editActions.exit)
  async exit(ctx: TelegrafContext) {
    ctx.session.type = undefined;
    await ctx.reply('Что ты хочешь от меня?', actionButtons());
  }
  @Hears(editActions.changeName)
  async changeName(ctx: TelegrafContext) {
    ctx.session.type = undefined;
    ctx.session.editType = 'changeName';
    await ctx.reply(`Введите новое название: `);
  }
  @Hears(editActions.changeVariant)
  async changeVariant(ctx: TelegrafContext) {
    ctx.session.type = undefined;
    ctx.session.editType = 'changeVariant';
    await ctx.reply(`Введите новый вариант: `);
  }
  @Hears(editActions.changeLabAmount)
  async changeLabAmount(ctx: TelegrafContext) {
    ctx.session.type = undefined;
    ctx.session.editType = 'changeLabAmount';
    await ctx.reply(`Введите общее кол-во лаб: `);
  }
  @Hears(editActions.addLab)
  async addLab(ctx: TelegrafContext) {
    ctx.session.type = undefined;
    ctx.session.editType = undefined;
    if (!ctx.session.currentItem) {
      await ctx.reply('Нет такого', editButtons());
      return;
    }
    if (ctx.session.currentItem.labs_done === ctx.session.currentItem.labs_all) {
      await ctx.reply('Придержи коней, ты уже все сдал, маэстро', actionButtons());
      return;
    }

    ctx.session.currentItem.labs_done += 1;
    this.subjectService.updateSubject(ctx.session.currentItem.id, ctx.session.currentItem);

    const message =
      ctx.session.currentItem.labs_all === ctx.session.currentItem.labs_done
        ? 'Ты все сдал, лучший!!!'
        : 'Осталось совсем немного, вперед';
    ctx.session.currentItem = undefined;
    await ctx.reply(message, actionButtons());
  }
  @Hears(editActions.removeLab)
  async removeLab(ctx: TelegrafContext) {
    ctx.session.type = undefined;
    ctx.session.editType = undefined;
    if (!ctx.session.currentItem) {
      await ctx.reply('Нет такого', editButtons());
      return;
    }
    if (ctx.session.currentItem.labs_done <= 0) {
      await ctx.reply('Как можно сдать меньше 0???');
      return;
    }
    ctx.session.currentItem.labs_done -= 1;
    this.subjectService.updateSubject(ctx.session.currentItem.id, ctx.session.currentItem);
    await ctx.reply('Не повезло, не фортануло', actionButtons());
  }

  @On('text')
  async getMessage(@Message('text') message: string, @Ctx() ctx: TelegrafContext) {
    if (!ctx.session.type && !ctx.session.editType) {
      return;
    }

    if (ctx.session.type) {
      switch (ctx.session.type) {
        case 'edit': {
          const subject = await this.subjectService.findOneByName(message);
          if (!subject) {
            await ctx.reply('Нет такого предмета', actionButtons());
            return;
          }
          ctx.session.currentItem = subject;
          await ctx.reply('Шо конкретно надо?', editButtons());
          break;
        }
        case 'add': {
          if (!message) {
            await ctx.reply('Ты ничего не ввел', actionButtons());
            return;
          }
          const [name, variant, labs_done, labs_all] = message.split(' ');

          if (!name || isNaN(Number(labs_done)) || isNaN(Number(labs_all)) || !variant) {
            await ctx.reply('Не та структура, идиот', actionButtons());
            return;
          }
          if (+labs_done < 0 || +labs_all < 0 || Number(variant) < 0 || +labs_all < +labs_done) {
            await ctx.reply('Такого не бывает', actionButtons());
            return;
          }
          await this.subjectService.createSubject({
            name,
            variant: variant,
            labs_all: +labs_all,
            labs_done: +labs_done,
          });
          await ctx.reply('Добавил с кайфом', actionButtons());
          break;
        }
        case 'delete': {
          const deleteSubject = await this.subjectService.findOneByName(message);
          if (!deleteSubject) {
            await ctx.reply('Нет такого предмета', actionButtons());
            return;
          }
          await this.subjectService.deleteSubject(deleteSubject.id);
          await ctx.reply('Удалил с кайфом', actionButtons());
          break;
        }
      }
    }
    if (ctx.session.editType) {
      switch (ctx.session.editType) {
        case 'changeName': {
          if (!ctx.session.currentItem) {
            await ctx.reply('Нет такого предмета', editButtons());
            return;
          }
          ctx.session.currentItem.name = message;
          this.subjectService.updateSubject(ctx.session.currentItem.id, ctx.session.currentItem);
          ctx.session.currentItem = undefined;
          await ctx.reply('Обновил с кайфом', actionButtons());
          break;
        }
        case 'changeVariant': {
          if (!ctx.session.currentItem) {
            await ctx.reply('Нет такого предмета', actionButtons());
            return;
          }
          ctx.session.currentItem.variant = message;
          this.subjectService.updateSubject(ctx.session.currentItem.id, ctx.session.currentItem);
          ctx.session.currentItem = undefined;
          await ctx.reply('Обновил с кайфом', actionButtons());
          break;
        }
        case 'changeLabAmount': {
          if (!ctx.session.currentItem) {
            await ctx.reply('Нет такого предмета', actionButtons());
            return;
          }
          if (!message || isNaN(Number(message)) || Number(message) < ctx.session.currentItem.labs_done) {
            await ctx.reply('Введите корректное значение', editButtons());
            return;
          }
          ctx.session.currentItem.labs_all = Number(message);
          this.subjectService.updateSubject(ctx.session.currentItem.id, ctx.session.currentItem);
          ctx.session.currentItem = undefined;
          await ctx.reply('Обновил с кайфом', actionButtons());
          break;
        }
        default: {
          ctx.session.currentItem = undefined;
          await ctx.reply('А зачем было меня дергать?', actionButtons());
          break;
        }
      }
    }
  }
}
