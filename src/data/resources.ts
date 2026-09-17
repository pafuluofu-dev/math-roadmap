export interface Resource {
  title: string
  /** Пустая строка — ссылки пока нет, владелец добавит */
  url: string
  note: string
}

/** Документ, из которого собран план, — не учебник, а первоисточник */
export interface SourceDoc {
  title: string
  url: string
  note: string
  pages: number
}

/* Лежит в public/, поэтому путь строится от BASE_URL: на GitHub Pages сборка
   идёт с --base=/math-roadmap/, и без префикса ссылка уехала бы в корень домена. */
export const PROGRAM_DOC: SourceDoc = {
  title: 'Рабочие программы по математике, 2025 и 2026',
  url: `${import.meta.env.BASE_URL}math-programs-2025-2026.pdf`,
  note:
    'первоисточник плана: сравнение двух программ, лекции и практики 2026 с полными формулировками вопросов, программа 2025 и её оценочные материалы — включая 23 вопроса зачёта первого семестра',
  pages: 8,
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
