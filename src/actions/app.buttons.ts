import { Markup } from 'telegraf';
import { mainActions } from '@consts/actions';
export function actionButtons() {
  return Markup.keyboard(
    [
      Markup.button.text(mainActions.list),
      Markup.button.text(mainActions.add),
      Markup.button.text(mainActions.edit),
      Markup.button.text(mainActions.delete),
    ],
    { columns: 2 },
  );
}
