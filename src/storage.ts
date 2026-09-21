import { SEED_NOTES, type UserNote } from './data/notebook'
import type { BlockId, SessionKind, SessionLink } from './data/plan'
import type { TheoryState } from './data/theory'
import { EMPTY_EDITS, type FolderFields, type NodeFields, type PlanEdits, type PlanLayout } from './planEdits'

export type { UserNote } from './data/notebook'

const STATE_KEY = 'math-roadmap:v1'
const THEME_KEY = 'math-roadmap:theme'

export type Theme = 'dark' | 'light'

/** Отметка задания проверки: получилось / наполовину / не получилось */
export type TaskMark = 'ok' | 'half' | 'fail'

/** Результат проверки или пробного экзамена */
export interface CheckResult {
  /** Баллы 0–100 */
  score: number
  /** «Что не получилось» — свободный текст */
  note: string
  /** Когда записан результат, ISO */
  at: string
}

/** Запись журнала ошибок с двумя датами повтора (+3 и +14 дней) */
export interface ErrorEntry {
  id: string
  createdAt: string
  topic: string
  text: string
  repeatAt: [string, string]
  done: [boolean, boolean]
}

/** Занятие «второго круга», добавленное владельцем в резервную неделю */
export interface CustomSession {
  id: string
  week: number
  date: string
  title: string
  minutes: number
}

export interface AppState {
  /** id занятия → дата отметки (ISO) */
  sessions: Record<string, string>
  /** id проверки → результат */
  checks: Record<string, CheckResult>
  /** «<id проверки>:<id задания>» → отметка; из отмеченных складывается балл проверки */
  taskMarks: Record<string, TaskMark>
  /** id вопроса теории → 0 «не знаю» / 1 «формулировка» / 2 «могу объяснить» */
  theory: Record<string, TheoryState>
  errors: ErrorEntry[]
  custom: CustomSession[]
  /** Свои заметки владельца — страница «Заметки» */
  notes: UserNote[]
  /** Правки плана: наложение поверх src/data/plan.ts, см. planEdits.ts */
  planEdits: PlanEdits
}

export const EMPTY_STATE: AppState = {
  sessions: {},
  checks: {},
  taskMarks: {},
  theory: {},
  errors: [],
  custom: [],
  notes: SEED_NOTES,
  planEdits: EMPTY_EDITS,
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function sanitizeSessions(raw: unknown): Record<string, string> {
  if (!isRecord(raw)) return {}
  const out: Record<string, string> = {}
  for (const [id, doneAt] of Object.entries(raw)) if (typeof doneAt === 'string') out[id] = doneAt
  return out
}

function sanitizeChecks(raw: unknown): Record<string, CheckResult> {
  if (!isRecord(raw)) return {}
  const out: Record<string, CheckResult> = {}
  for (const [id, result] of Object.entries(raw)) {
    if (!isRecord(result)) continue
    const score = Number(result.score)
    if (!Number.isFinite(score)) continue
    out[id] = {
      score: Math.min(100, Math.max(0, score)),
      note: typeof result.note === 'string' ? result.note : '',
      at: typeof result.at === 'string' ? result.at : '',
    }
  }
  return out
}

function sanitizeTheory(raw: unknown): Record<string, TheoryState> {
  if (!isRecord(raw)) return {}
  const out: Record<string, TheoryState> = {}
  for (const [id, state] of Object.entries(raw)) if (state === 0 || state === 1 || state === 2) out[id] = state
  return out
}

function sanitizeErrors(raw: unknown): ErrorEntry[] {
  if (!Array.isArray(raw)) return []
  return raw.filter(
    (entry): entry is ErrorEntry =>
      isRecord(entry) &&
      typeof entry.id === 'string' &&
      typeof entry.createdAt === 'string' &&
      typeof entry.topic === 'string' &&
      typeof entry.text === 'string' &&
      Array.isArray(entry.repeatAt) &&
      entry.repeatAt.length === 2 &&
      entry.repeatAt.every((d: unknown) => typeof d === 'string') &&
      Array.isArray(entry.done) &&
      entry.done.length === 2 &&
      entry.done.every((f: unknown) => typeof f === 'boolean'),
  )
}

function sanitizeCustom(raw: unknown): CustomSession[] {
  if (!Array.isArray(raw)) return []
  return raw.filter(
    (entry): entry is CustomSession =>
      isRecord(entry) &&
      typeof entry.id === 'string' &&
      typeof entry.week === 'number' &&
      typeof entry.date === 'string' &&
      typeof entry.title === 'string' &&
      typeof entry.minutes === 'number',
  )
}

/* Поля не было в первых копиях: undefined — не «пусто», а «ещё не заводили», и тогда даём стартовые заметки.
   Пустой массив — владелец всё удалил, назад не возвращаем. */
function sanitizeNotes(raw: unknown): UserNote[] {
  if (raw === undefined) return SEED_NOTES
  if (!Array.isArray(raw)) return []
  return raw
    .filter((entry): entry is UserNote => isRecord(entry) && typeof entry.id === 'string' && typeof entry.title === 'string' && typeof entry.body === 'string')
    .map((entry) => ({
      id: entry.id,
      title: entry.title,
      body: entry.body,
      createdAt: typeof entry.createdAt === 'string' ? entry.createdAt : '',
      updatedAt: typeof entry.updatedAt === 'string' ? entry.updatedAt : '',
    }))
}

const BLOCK_IDS: readonly string[] = ['A', 'B', 'C']
const SESSION_KINDS: readonly string[] = ['study', 'check', 'exam', 'diagnostic', 'rest']

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

/** Патч недели: берём только поля известных типов, остальное отбрасываем */
function folderPatch(raw: unknown): Partial<FolderFields> | undefined {
  if (!isRecord(raw)) return undefined
  const out: Partial<FolderFields> = {}
  if (typeof raw.block === 'string' && BLOCK_IDS.includes(raw.block)) out.block = raw.block as BlockId
  if (typeof raw.from === 'string') out.from = raw.from
  if (typeof raw.to === 'string') out.to = raw.to
  if (typeof raw.focus === 'string') out.focus = raw.focus
  if (typeof raw.note === 'string') out.note = raw.note
  return out
}

function nodePatch(raw: unknown): Partial<NodeFields> | undefined {
  if (!isRecord(raw)) return undefined
  const out: Partial<NodeFields> = {}
  if (typeof raw.date === 'string') out.date = raw.date
  if (typeof raw.kind === 'string' && SESSION_KINDS.includes(raw.kind)) out.kind = raw.kind as SessionKind
  if (typeof raw.title === 'string') out.title = raw.title
  if (typeof raw.minutes === 'number' && Number.isFinite(raw.minutes)) out.minutes = raw.minutes
  if (typeof raw.notes === 'string') out.notes = raw.notes
  if (Array.isArray(raw.links)) {
    out.links = raw.links.filter((link): link is SessionLink => isRecord(link) && typeof link.label === 'string' && typeof link.url === 'string')
  }
  if (Array.isArray(raw.topics)) out.topics = raw.topics.filter((topic): topic is number => typeof topic === 'number')
  if (isStringArray(raw.questions)) out.questions = raw.questions
  return out
}

function isFolderFields(patch: Partial<FolderFields>): patch is FolderFields {
  return !!patch.block && typeof patch.from === 'string' && typeof patch.to === 'string' && typeof patch.focus === 'string'
}

function isNodeFields(patch: Partial<NodeFields>): patch is NodeFields {
  return typeof patch.date === 'string' && !!patch.kind && typeof patch.title === 'string' && typeof patch.minutes === 'number'
}

function recordOf<T>(raw: Record<string, unknown>, parse: (value: unknown, key: string) => T | undefined): Record<string, T> {
  const out: Record<string, T> = {}
  for (const [key, value] of Object.entries(raw)) {
    const parsed = parse(value, key)
    if (parsed !== undefined) out[key] = parsed
  }
  return out
}

function sanitizeLayout(raw: unknown): PlanLayout | null {
  if (!isRecord(raw) || !Array.isArray(raw.folders)) return null
  const folders: PlanLayout['folders'] = []
  for (const folder of raw.folders) {
    if (!isRecord(folder) || typeof folder.id !== 'string' || !Array.isArray(folder.nodes)) continue
    folders.push({ id: folder.id, nodes: folder.nodes.filter((id): id is string => typeof id === 'string') })
  }
  return { folders }
}

/* Копии без поля правок (до редактора) читаются как «правок нет». Сломанная форма любого поля —
   тоже «правок нет»: с полусохранённым наложением план разъедется хуже, чем с исходным. */
export function sanitizePlanEdits(raw: unknown): PlanEdits {
  if (raw === undefined) return EMPTY_EDITS
  if (!isRecord(raw)) return EMPTY_EDITS
  const { layout, folders, nodes, addedFolders, addedNodes, deleted } = raw
  const recordOrMissing = (value: unknown) => value === undefined || isRecord(value)
  if (
    !(layout === undefined || layout === null || isRecord(layout)) ||
    !recordOrMissing(folders) ||
    !recordOrMissing(nodes) ||
    !recordOrMissing(addedFolders) ||
    !recordOrMissing(addedNodes) ||
    !(deleted === undefined || Array.isArray(deleted))
  ) {
    return EMPTY_EDITS
  }
  return {
    layout: sanitizeLayout(layout),
    folders: isRecord(folders) ? recordOf(folders, folderPatch) : {},
    nodes: isRecord(nodes) ? recordOf(nodes, nodePatch) : {},
    addedFolders: isRecord(addedFolders)
      ? recordOf(addedFolders, (value, id) => {
          const fields = folderPatch(value)
          return fields && isFolderFields(fields) ? { ...fields, id } : undefined
        })
      : {},
    addedNodes: isRecord(addedNodes)
      ? recordOf(addedNodes, (value, id) => {
          const fields = nodePatch(value)
          return fields && isNodeFields(fields) ? { ...fields, id } : undefined
        })
      : {},
    deleted: Array.isArray(deleted) ? deleted.filter((id): id is string => typeof id === 'string') : [],
  }
}

function sanitizeTaskMarks(raw: unknown): Record<string, TaskMark> {
  if (!isRecord(raw)) return {}
  const out: Record<string, TaskMark> = {}
  for (const [key, mark] of Object.entries(raw)) if (mark === 'ok' || mark === 'half' || mark === 'fail') out[key] = mark
  return out
}

export function sanitizeState(raw: unknown): AppState {
  if (!isRecord(raw)) return EMPTY_STATE
  return {
    sessions: sanitizeSessions(raw.sessions),
    checks: sanitizeChecks(raw.checks),
    taskMarks: sanitizeTaskMarks(raw.taskMarks),
    theory: sanitizeTheory(raw.theory),
    errors: sanitizeErrors(raw.errors),
    custom: sanitizeCustom(raw.custom),
    notes: sanitizeNotes(raw.notes),
    planEdits: sanitizePlanEdits(raw.planEdits),
  }
}

/* При смене схемы: поднять номер в STATE_KEY, прочитать старый ключ,
   преобразовать и записать в новый — не стирать прогресс. */
export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STATE_KEY)
    if (!raw) return EMPTY_STATE
    return sanitizeState(JSON.parse(raw))
  } catch {
    return EMPTY_STATE
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state))
  } catch {
    /* приватный режим или заблокированное хранилище — просто не сохраняем */
  }
}

/** Тот же ключ читает инлайн-скрипт в index.html до первой отрисовки */
export function loadTheme(): Theme {
  try {
    return localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

export function saveTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {
    /* см. выше */
  }
}
