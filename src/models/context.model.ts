import { Subject } from '@api/subject/entities/subject.entity';
import { editActions, mainActions } from '@consts/actions';
import { Context } from 'telegraf';

export interface TelegrafContext extends Context {
  session: {
    type?: keyof typeof mainActions;
    editType?: keyof typeof editActions;
    currentItem?: Subject;
  };
}
