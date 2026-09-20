import { WEEKS, type BlockId, type Session, type SessionKind, type SessionLink } from './data/plan'
import { todayISO } from './dates'
import { applyEdits, type EffectivePlan, type PlanEdits, type PlanWeek } from './planEdits'
import type { AppState, CustomSession, ErrorEntry } from './storage'

let cachedEdits: PlanEdits | undefined
let cachedPlan: EffectivePlan | undefined

/** Итоговый план для состояния: исходные недели плюс правки владельца. Пересчёт только при смене объекта правок — страницы зовут это на каждом рендере */
export function planOf(state: AppState): EffectivePlan {
  if (!cachedPlan || cachedEdits !== state.planEdits) {
    cachedEdits = state.planEdits
    cachedPlan = applyEdits(WEEKS, state.planEdits)
  }
  return cachedPlan
}

/** Отдых — событие без галочки, в прогресс не входит */
export function isCountable(session: Session): boolean {
  return session.kind !== 'rest'
}

export interface Progress {
  done: number
  total: number
  doneMinutes: number
  totalMinutes: number
}

export function percentOf(progress: Progress): number {
  return progress.total ? Math.round((progress.done / progress.total) * 100) : 0
}

function tally(sessions: Session[], custom: CustomSession[], doneMap: Record<string, string>): Progress {
  const countable = sessions.filter(isCountable)
  const items: { id: string; minutes: number }[] = [
    ...countable.map((s) => ({ id: s.id, minutes: s.minutes })),
    ...custom.map((c) => ({ id: c.id, minutes: c.minutes })),
  ]
  const doneItems = items.filter((item) => doneMap[item.id])
  return {
    done: doneItems.length,
    total: items.length,
    doneMinutes: doneItems.reduce((sum, item) => sum + item.minutes, 0),
    totalMinutes: items.reduce((sum, item) => sum + item.minutes, 0),
  }
}

/* «Второй круг» привязан к исходному номеру недели (baseN), а не к позиционному:
   после перестановок и удалений позиционный номер плывёт, а добавленные занятия должны остаться на месте */
export function weekProgress(week: PlanWeek, state: AppState): Progress {
  return tally(week.sessions, state.custom.filter((c) => c.week === week.baseN), state.sessions)
}

export function blockProgress(blockId: BlockId, state: AppState): Progress {
  const weeks = planOf(state).weeks.filter((w) => w.block === blockId)
  const weekNumbers = weeks.flatMap((w) => (w.baseN === undefined ? [] : [w.baseN]))
  const sessions = weeks.flatMap((w) => w.sessions)
  return tally(sessions, state.custom.filter((c) => weekNumbers.includes(c.week)), state.sessions)
}

/** Занятия второго круга из недель, которые ещё есть в плане: удалённую неделю не видно, и в счёт она не идёт */
function liveCustom(state: AppState): CustomSession[] {
  const live = new Set(planOf(state).weeks.flatMap((week) => (week.baseN === undefined ? [] : [week.baseN])))
  return state.custom.filter((entry) => live.has(entry.week))
}

export function overallProgress(state: AppState): Progress {
  return tally(planOf(state).sessions, liveCustom(state), state.sessions)
}

/** Занятие в карточке «Сегодня»: плановое или добавленное во «второй круг» */
export interface TodayItem {
  id: string
  date: string
  kind: SessionKind | 'custom'
  title: string
  minutes: number
  notes?: string
  links?: SessionLink[]
  topics?: number[]
  questions?: string[]
}

export interface TodayView {
  /** Занятие на сегодня или ближайшее неотмеченное */
  session: TodayItem | null
  /** true — занятие именно сегодняшнее */
  isToday: boolean
  /** Сегодняшнее уже отмечено: показать «На сегодня всё», session — следующее */
  todayDone: boolean
}

/** «Сегодня» на обзоре: занятие с сегодняшней датой, иначе самое раннее неотмеченное */
export function todayView(state: AppState): TodayView {
  const today = todayISO()
  const countable: TodayItem[] = [
    ...planOf(state).sessions.filter(isCountable),
    ...liveCustom(state).map((c) => ({ id: c.id, date: c.date, kind: 'custom' as const, title: c.title, minutes: c.minutes })),
  ].sort((a, b) => a.date.localeCompare(b.date))
  const ofToday = countable.filter((s) => s.date === today)
  const unfinishedToday = ofToday.find((s) => !state.sessions[s.id])
  if (unfinishedToday) return { session: unfinishedToday, isToday: true, todayDone: false }

  const nextUnfinished = countable.find((s) => !state.sessions[s.id] && (ofToday.length === 0 || s.date > today)) ?? null
  if (ofToday.length > 0) return { session: nextUnfinished, isToday: false, todayDone: true }
  const earliest = countable.find((s) => !state.sessions[s.id]) ?? null
  return { session: earliest, isToday: false, todayDone: false }
}

export interface DueRepeat {
  entry: ErrorEntry
  /** 0 — повтор «+3 дня», 1 — «+14 дней» */
  index: 0 | 1
}

/** «К повтору сегодня»: наступившие и не отмеченные повторы журнала ошибок */
export function dueRepeats(errors: ErrorEntry[]): DueRepeat[] {
  const today = todayISO()
  const due: DueRepeat[] = []
  for (const entry of errors) {
    ;([0, 1] as const).forEach((index) => {
      if (!entry.done[index] && entry.repeatAt[index] <= today) due.push({ entry, index })
    })
  }
  return due.sort((a, b) => a.entry.repeatAt[a.index].localeCompare(b.entry.repeatAt[b.index]))
}

/** Неделя, в которую попадает сегодняшняя дата */
export function currentWeek(state: AppState): PlanWeek | undefined {
  const today = todayISO()
  return planOf(state).weeks.find((w) => w.from <= today && today <= w.to)
}

/** Занятие пропущено: дата прошла, галочки нет */
export function isMissed(session: Session, state: AppState): boolean {
  return isCountable(session) && session.date < todayISO() && !state.sessions[session.id]
}
