import { BLOCKS, type BlockId, type Session } from './data/plan'
import { fmtRange, parseISO } from './dates'
import type { EffectivePlan, PlanWeek } from './planEdits'
import { blockProgress, currentWeek, isCountable, overallProgress, percentOf, weekProgress } from './progress'
import type { AppState, CustomSession } from './storage'

/* Дерево плана — плоское представление тех же данных, что рисует страница «План»:
   корень → блоки A/B/C → недели → занятия. Ничего своего оно не считает: прогресс берётся
   теми же функциями из progress.ts, а план — итоговый, уже с правками владельца. */

export interface TreeNode {
  id: string
  label: string
  /** Серая подпись справа: даты, часы, счётчик */
  meta?: string
  /** done — сделано; current — идёт сейчас; muted — отдых / отложено / по желанию; иначе обычный */
  status?: 'done' | 'current' | 'muted'
  /** Цветовая ветка: 'a' | 'b' | 'c' (блок или трек) */
  branch?: 'a' | 'b' | 'c'
  /** Папка: ветку можно свернуть, даже когда внутри пусто — узел без детей пустой папкой не становится */
  folder?: boolean
  children: TreeNode[]
}

const BRANCH_OF: Record<BlockId, 'a' | 'b' | 'c'> = { A: 'a', B: 'b', C: 'c' }

const KIND_LABEL: Record<Session['kind'], string> = {
  study: 'занятие',
  diagnostic: 'диагностика',
  check: 'проверка',
  exam: 'экзамен',
  rest: 'отдых',
}

/** «12.09» — короткая дата занятия; в дереве строка узкая, месяц словом не влезает */
function fmtShort(iso: string): string {
  const date = parseISO(iso)
  return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}`
}

function joinMeta(parts: (string | false | undefined)[]): string {
  return parts.filter((part): part is string => !!part).join(' · ')
}

function sessionNode(session: Session, state: AppState, branch: 'a' | 'b' | 'c'): TreeNode {
  const done = isCountable(session) && !!state.sessions[session.id]
  return {
    id: session.id,
    label: session.title,
    meta: joinMeta([fmtShort(session.date), KIND_LABEL[session.kind], session.minutes > 0 && `${session.minutes} мин`]),
    status: done ? 'done' : session.kind === 'rest' ? 'muted' : undefined,
    branch,
    children: [],
  }
}

/** Занятие второго круга живёт в своей неделе наравне с плановыми, но подписано «второй круг» */
function customNode(entry: CustomSession, state: AppState, branch: 'a' | 'b' | 'c'): TreeNode {
  return {
    id: entry.id,
    label: entry.title,
    meta: joinMeta([fmtShort(entry.date), 'второй круг', entry.minutes > 0 && `${entry.minutes} мин`]),
    status: state.sessions[entry.id] ? 'done' : undefined,
    branch,
    children: [],
  }
}

function weekNode(week: PlanWeek, state: AppState, currentId: string | undefined): TreeNode {
  const branch = BRANCH_OF[week.block]
  const progress = weekProgress(week, state)
  const allDone = progress.total > 0 && progress.done === progress.total
  // Второй круг привязан к исходному номеру недели (baseN) — у своих недель его нет, и добавленных занятий там не бывает
  const custom = state.custom.filter((entry) => entry.week === week.baseN).sort((a, b) => a.date.localeCompare(b.date))
  return {
    id: week.id,
    label: `Неделя ${week.n} · ${week.focus}`,
    meta: joinMeta([fmtRange(week.from, week.to), progress.total > 0 ? `${progress.done} / ${progress.total}` : 'занятий нет']),
    status: allDone ? 'done' : week.id === currentId ? 'current' : undefined,
    branch,
    folder: true,
    children: [...week.sessions.map((session) => sessionNode(session, state, branch)), ...custom.map((entry) => customNode(entry, state, branch))],
  }
}

function blockNode(id: BlockId, title: string, weeks: PlanWeek[], state: AppState, currentId: string | undefined): TreeNode {
  const progress = blockProgress(id, state)
  const first = weeks[0]
  const last = weeks[weeks.length - 1]
  return {
    id: `block-${id}`,
    label: `Блок ${id} · ${title}`,
    meta: joinMeta([first && last ? `недели ${first.n}–${last.n}` : 'нет недель', `${progress.done} / ${progress.total} занятий`]),
    // Блок со всеми отмеченными занятиями прячется фильтром «Скрыть сделанное» целиком, как и неделя
    status: progress.total > 0 && progress.done === progress.total ? 'done' : undefined,
    branch: BRANCH_OF[id],
    folder: true,
    children: weeks.map((week) => weekNode(week, state, currentId)),
  }
}

/** Корень — название плана с общим прогрессом; ниже блоки в порядке BLOCKS, недели — в порядке итогового плана */
export function buildTree(plan: EffectivePlan, state: AppState): TreeNode {
  const progress = overallProgress(state)
  const currentId = currentWeek(state)?.id
  return {
    id: 'root',
    label: 'Маршрут: математика',
    meta: `${percentOf(progress)} % · сделано ${progress.done} из ${progress.total}`,
    status: progress.total > 0 && progress.done === progress.total ? 'done' : undefined,
    folder: true,
    children: BLOCKS.map((block) =>
      blockNode(
        block.id,
        block.title,
        plan.weeks.filter((week) => week.block === block.id),
        state,
        currentId,
      ),
    ),
  }
}
