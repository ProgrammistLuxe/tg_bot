import { Markup } from 'telegraf';
import { editActions } from '@consts/actions';
export function editButtons() {
  return Markup.keyboard(
    [
      Markup.button.text(editActions.exit),
      Markup.button.text(editActions.changeName),
      Markup.button.text(editActions.addLab),
      Markup.button.text(editActions.removeLab),
    ],
    { columns: 3 },
  );
}
