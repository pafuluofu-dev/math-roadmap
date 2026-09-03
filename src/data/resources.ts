export interface Resource {
  title: string
  /** Пустая строка — ссылки пока нет, владелец добавит */
  url: string
  note: string
}

export const RESOURCES: Resource[] = [
  {
    title: 'Шипачёв В. С. «Высшая математика»',
    url: 'https://urait.ru/bcode/468424',
    note: 'теория',
  },
  {
    title: 'Логинова В. В. и др. «Математический анализ. Сборник заданий»',
    url: 'https://urait.ru/bcode/493329',
    note: 'задачи',
  },
  {
    title: 'Ильин, Садовничий, Сендов «Математический анализ», ч. 1',
    url: 'https://urait.ru/bcode/491294',
    note: 'теория',
  },
  {
    title: 'Типовые расчёты кафедры ВМ РУТ (МИИТ)',
    url: '',
    note: 'ссылку добавит владелец',
  },
]
