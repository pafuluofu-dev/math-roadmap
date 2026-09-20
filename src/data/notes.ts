/* Конспекты по темам 1–24. Тексты лежат рядом обычными .md — их можно править в любом редакторе,
   Vite подставляет содержимое строкой через ?raw. Разметку разбирает src/components/Markdown.tsx. */
import group1 from './notes/1-matrices-slau.md?raw'
import group2 from './notes/2-vectors.md?raw'
import group3 from './notes/3-geometry.md?raw'
import group4 from './notes/4-functions-limits.md?raw'
import group5 from './notes/5-infinitesimals-continuity.md?raw'
import group6 from './notes/6-derivative.md?raw'
import group7 from './notes/7-differential-lhopital.md?raw'

export interface Note {
  id: number
  title: string
  /** Номера тем программы, которые закрывает конспект */
  topics: number[]
  /** Markdown-подмножество: ## / ### / абзацы / списки / > / таблицы / --- / $…$ */
  body: string
}

export const NOTES: Note[] = [
  { id: 1, title: 'Матрицы, определители и СЛАУ', topics: [1, 2, 3, 4], body: group1 },
  { id: 2, title: 'Векторная алгебра', topics: [5, 6, 7], body: group2 },
  { id: 3, title: 'Аналитическая геометрия', topics: [8, 9, 10, 11], body: group3 },
  { id: 4, title: 'Функции, последовательности и предел функции', topics: [12, 13, 14], body: group4 },
  { id: 5, title: 'Бесконечно малые, замечательные пределы, непрерывность', topics: [15, 16, 17], body: group5 },
  { id: 6, title: 'Производная: определение и техника дифференцирования', topics: [18, 19, 20, 21], body: group6 },
  { id: 7, title: 'Дифференциал, теоремы о среднем и правило Лопиталя', topics: [22, 23, 24], body: group7 },
]
