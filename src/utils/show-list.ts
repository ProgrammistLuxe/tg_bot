import { Subject } from '@api/subject/entities/subject.entity';

export function showList(list: Subject[]) {
  return `${list.map((subject) => `${subject.name}, вариант ${subject.variant}, лаб сдано: ${subject.labs_done}/${subject.labs_all}\n`).join('')}`;
}
