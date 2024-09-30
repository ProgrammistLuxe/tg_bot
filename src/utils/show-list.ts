export function showList(list: any[]) {
  return `${list.map((subject) => `${subject.name}: Лаб сдано: ${subject.labs_done}/${subject.labs_all}\n`).join('')}`;
}
