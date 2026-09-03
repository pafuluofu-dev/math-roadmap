import { MINI_CHECK_DATES, miniCheckId, PASS_THRESHOLD } from './plan'

export interface Check {
  id: string
  date: string
  title: string
  /** Что покрывает проверка */
  scope: string
  /** Формат: сколько задач, сколько минут */
  format: string
  /** Порог сдачи, % */
  threshold: number
}

const NAMED_CHECKS: Check[] = [
  {
    id: 'diag',
    date: '2026-09-02',
    title: 'Диагностика',
    scope: 'все блоки',
    format: '6 задач, 40 мин, без конспекта',
    threshold: PASS_THRESHOLD,
  },
  {
    id: 'check-01',
    date: '2026-09-12',
    title: 'Проверка №1',
    scope: 'матрицы, векторы',
    format: '6 задач + 2 вопроса теории, 60 мин',
    threshold: PASS_THRESHOLD,
  },
  {
    id: 'check-02',
    date: '2026-09-19',
    title: 'Проверка №2',
    scope: 'кривые, Лопиталь, параметрические, высшие порядки',
    format: '6 задач + 2 вопроса теории, 60 мин',
    threshold: PASS_THRESHOLD,
  },
  {
    id: 'check-03',
    date: '2026-09-26',
    title: 'Проверка №3',
    scope: 'СЛАУ, прямая на плоскости',
    format: '6 задач + 2 вопроса теории, 60 мин',
    threshold: PASS_THRESHOLD,
  },
  {
    id: 'exam-01',
    date: '2026-10-03',
    title: 'Пробный экзамен №1',
    scope: 'алгебра + геометрия',
    format: 'билет: 2 вопроса теории + 4 задачи, 90 мин',
    threshold: PASS_THRESHOLD,
  },
  {
    id: 'check-04',
    date: '2026-10-10',
    title: 'Проверка №4',
    scope: 'пределы, часть 1',
    format: '6 задач + 2 вопроса теории, 60 мин',
    threshold: PASS_THRESHOLD,
  },
  {
    id: 'check-05',
    date: '2026-10-17',
    title: 'Проверка №5',
    scope: 'пределы, часть 2',
    format: '6 задач + 2 вопроса теории, 60 мин',
    threshold: PASS_THRESHOLD,
  },
  {
    id: 'exam-02',
    date: '2026-10-24',
    title: 'Пробный экзамен №2',
    scope: 'пределы + непрерывность',
    format: 'билет, 90 мин',
    threshold: PASS_THRESHOLD,
  },
  {
    id: 'check-06',
    date: '2026-10-31',
    title: 'Проверка №6',
    scope: 'производная, часть 1',
    format: '6 задач + 2 вопроса теории, 60 мин',
    threshold: PASS_THRESHOLD,
  },
  {
    id: 'check-07',
    date: '2026-11-07',
    title: 'Проверка №7',
    scope: 'производная, часть 2',
    format: '6 задач + 2 вопроса теории, 60 мин',
    threshold: PASS_THRESHOLD,
  },
  {
    id: 'check-08',
    date: '2026-11-14',
    title: 'Проверка №8',
    scope: 'теоремы о среднем, экстремумы, выпуклость, асимптоты',
    format: '6 задач + 2 вопроса теории, 60 мин',
    threshold: PASS_THRESHOLD,
  },
  {
    id: 'exam-03',
    date: '2026-11-21',
    title: 'Пробный экзамен №3',
    scope: 'весь семестр',
    format: 'билет, 90 мин',
    threshold: PASS_THRESHOLD,
  },
  {
    id: 'exam-04',
    date: '2026-12-19',
    title: 'Пробный экзамен №4',
    scope: 'весь семестр',
    format: 'билет, 90 мин',
    threshold: PASS_THRESHOLD,
  },
  {
    id: 'exam-05',
    date: '2027-01-30',
    title: 'Пробный экзамен №5',
    scope: 'весь семестр',
    format: 'билет, 90 мин',
    threshold: PASS_THRESHOLD,
  },
]

const MINI_CHECKS: Check[] = MINI_CHECK_DATES.map((date) => ({
  id: miniCheckId(date),
  date,
  title: 'Мини-проверка',
  scope: 'темы 1–24 вразброс',
  format: '3 задачи, 15 мин',
  threshold: PASS_THRESHOLD,
}))

export const CHECKS: Check[] = [...NAMED_CHECKS, ...MINI_CHECKS].sort((a, b) => a.date.localeCompare(b.date))

/** Правило оценивания, показывается под формой результата */
export const SCORING_RULE = 'Задача с вычислительной ошибкой = полбалла.'
