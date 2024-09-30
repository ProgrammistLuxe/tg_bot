import { Context } from 'telegraf';
import { ISubject } from './subject.model';

export interface TelegrafContext extends Context {
  session: {
    type?: 'add' | 'edit' | 'delete';
    editType?: 'exit' | 'changeName' | 'addLab' | 'removeLab';
    currentItem?: ISubject;
  };
}
