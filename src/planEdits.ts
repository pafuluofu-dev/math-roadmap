import { ALL_SESSIONS, WEEKS, type BlockId, type Session, type Week } from './data/plan'
import { addDays, parseISO, todayISO } from './dates'

/* Правки плана владельцем — наложение поверх исходных данных из src/data/plan.ts.
   Сами данные не меняются: они остаются источником по умолчанию, а всё, что владелец
   переставил, добавил, поправил или удалил, хранится здесь и накладывается при чтении (applyEdits).
   Id встроенных недель (week-<n>) и занятий стабильны и от позиции не зависят — галочки и
   результаты переживают любые перестановки; номер недели в итоговом плане позиционный. */

/** Поля недели, которые правит владелец; номер n — позиционный и в правках не хранится */
export interface FolderFields {
  block: BlockId
  from: string
  to: string
  focus: string
  note?: string
}

/** Поля занятия без id: у встроенных id стабилен, свои получают u-… при добавлении */
export type NodeFields = Omit<Session, 'id'>

export interface PlanLayout {
  /** Полный порядок папок и их узлов. null — исходный порядок */
  folders: { id: string; nodes: string[] }[]
}

export interface PlanEdits {
  layout: PlanLayout | null
  /** Правки встроенных папок по id: только изменённые поля */
  folders: Record<string, Partial<FolderFields>>
  /** Правки встроенных узлов по id: только изменённые поля */
  nodes: Record<string, Partial<NodeFields>>
  /** Свои папки и узлы целиком */
  addedFolders: Record<string, FolderFields & { id: string }>
  addedNodes: Record<string, NodeFields & { id: string }>
  /** Удалённые встроенные папки/узлы */
  deleted: string[]
}

export const EMPTY_EDITS: PlanEdits = { layout: null, folders: {}, nodes: {}, addedFolders: {}, addedNodes: {}, deleted: [] }

/** Неделя итогового плана: n — позиционный, id — ключ папки в наложении */
export interface PlanWeek extends Week {
  id: string
  /** Исходный номер встроенной недели — к нему привязаны занятия «второго круга»; у своих недель его нет */
  baseN?: number
}

export interface EffectivePlan {
  weeks: PlanWeek[]
  sessions: Session[]
}

export function weekId(n: number): string {
  return `week-${n}`
}

const BASE_NODE_IDS = new Set(ALL_SESSIONS.map((session) => session.id))

export function hasEdits(edits: PlanEdits): boolean {
  return (
    edits.layout !== null ||
    Object.keys(edits.folders).length + Object.keys(edits.nodes).length + Object.keys(edits.addedFolders).length + Object.keys(edits.addedNodes).length > 0 ||
    edits.deleted.length > 0
  )
}

/** Итоговый план: порядок из layout (или исходный), патчи поверх встроенных, свои папки и узлы из added* */
export function applyEdits(base: Week[], edits: PlanEdits): EffectivePlan {
  const deleted = new Set(edits.deleted)
  const baseFolders = new Map(base.map((week) => [weekId(week.n), week]))
  const baseNodes = new Map<string, { session: Session; folderId: string }>()
  for (const week of base) for (const session of week.sessions) baseNodes.set(session.id, { session, folderId: weekId(week.n) })
  const liveFolder = (id: string) => !deleted.has(id) && (baseFolders.has(id) || id in edits.addedFolders)
  const liveNode = (id: string) => !deleted.has(id) && (baseNodes.has(id) || id in edits.addedNodes)

  const folders: { id: string; nodes: string[] }[] = []
  const placedFolders = new Set<string>()
  const placedNodes = new Set<string>()
  const place = (id: string, nodes: string[]) => {
    if (placedFolders.has(id) || !liveFolder(id)) return
    placedFolders.add(id)
    const kept: string[] = []
    for (const nodeId of nodes) {
      if (placedNodes.has(nodeId) || !liveNode(nodeId)) continue
      placedNodes.add(nodeId)
      kept.push(nodeId)
    }
    folders.push({ id, nodes: kept })
  }

  if (edits.layout) for (const folder of edits.layout.folders) place(folder.id, folder.nodes)
  // Недели, которых layout не знает (появились в коде позже или layout ещё не было), — в конец в исходном порядке
  for (const week of base) place(weekId(week.n), week.sessions.map((session) => session.id))
  for (const id of Object.keys(edits.addedFolders)) place(id, [])
  // Занятия из кода, не попавшие ни в одну папку, — в конец своей исходной недели, а если её уже нет — в конец последней
  const last = folders[folders.length - 1]
  for (const [id, { folderId }] of baseNodes) {
    if (placedNodes.has(id) || deleted.has(id)) continue
    const target = folders.find((folder) => folder.id === folderId) ?? last
    if (!target) continue
    placedNodes.add(id)
    target.nodes.push(id)
  }

  const weeks: PlanWeek[] = folders.map((folder, index) => {
    const baseWeek = baseFolders.get(folder.id)
    const fields: FolderFields = baseWeek
      ? { block: baseWeek.block, from: baseWeek.from, to: baseWeek.to, focus: baseWeek.focus, note: baseWeek.note, ...edits.folders[folder.id] }
      : edits.addedFolders[folder.id]
    const sessions = folder.nodes.map((id): Session => {
      const baseNode = baseNodes.get(id)
      return baseNode ? { ...baseNode.session, ...edits.nodes[id], id } : { ...edits.addedNodes[id], id }
    })
    return { ...fields, id: folder.id, n: index + 1, baseN: baseWeek?.n, sessions }
  })
  return { weeks, sessions: weeks.flatMap((week) => week.sessions) }
}

/* Операции редактора — чистые функции над PlanEdits. Каждая берёт порядок из ИТОГОВОГО плана,
   а не из edits.layout: так занятия, добавленные в src/data после сохранения layout, не теряются. */

function planOf(edits: PlanEdits): EffectivePlan {
  return applyEdits(WEEKS, edits)
}

function layoutOf(plan: EffectivePlan): PlanLayout {
  return { folders: plan.weeks.map((week) => ({ id: week.id, nodes: week.sessions.map((session) => session.id) })) }
}

function newId(prefix: string, taken: Record<string, unknown>): string {
  const stamp = Date.now().toString(36)
  let id = `${prefix}-${stamp}`
  // Два добавления в одну миллисекунду — подстраховка суффиксом
  for (let i = 2; id in taken; i += 1) id = `${prefix}-${stamp}-${i}`
  return id
}

function clampIndex(index: number | undefined, length: number): number {
  return index === undefined ? length : Math.min(Math.max(0, index), length)
}

/** Забыть папки/узлы: свои — стереть целиком, встроенные — в deleted; их патчи больше не нужны */
function forget(edits: PlanEdits, ids: string[]): PlanEdits {
  const next: PlanEdits = {
    ...edits,
    folders: { ...edits.folders },
    nodes: { ...edits.nodes },
    addedFolders: { ...edits.addedFolders },
    addedNodes: { ...edits.addedNodes },
    deleted: [...edits.deleted],
  }
  for (const id of ids) {
    if (id in next.addedFolders) delete next.addedFolders[id]
    else if (id in next.addedNodes) delete next.addedNodes[id]
    else if (!next.deleted.includes(id)) next.deleted.push(id)
    delete next.folders[id]
    delete next.nodes[id]
  }
  return next
}

export function addFolder(edits: PlanEdits, fields: FolderFields, afterFolderId?: string): PlanEdits {
  const layout = layoutOf(planOf(edits))
  const id = newId('f', edits.addedFolders)
  const after = afterFolderId ? layout.folders.findIndex((folder) => folder.id === afterFolderId) : -1
  layout.folders.splice(after < 0 ? layout.folders.length : after + 1, 0, { id, nodes: [] })
  return { ...edits, layout, addedFolders: { ...edits.addedFolders, [id]: { ...fields, id } } }
}

export function updateFolder(edits: PlanEdits, id: string, patch: Partial<FolderFields>): PlanEdits {
  if (id in edits.addedFolders) return { ...edits, addedFolders: { ...edits.addedFolders, [id]: { ...edits.addedFolders[id], ...patch, id } } }
  if (!WEEKS.some((week) => weekId(week.n) === id)) return edits
  return { ...edits, folders: { ...edits.folders, [id]: { ...edits.folders[id], ...patch } } }
}

/** Сдвиг недели на delta позиций среди недель ТОГО ЖЕ блока: порядок в layout общий, но блоки на странице показаны раздельно */
export function moveFolder(edits: PlanEdits, id: string, delta: number): PlanEdits {
  const plan = planOf(edits)
  const week = plan.weeks.find((entry) => entry.id === id)
  if (!week) return edits
  const siblings = plan.weeks.filter((entry) => entry.block === week.block)
  const target = siblings[siblings.indexOf(week) + delta]
  if (!target) return edits
  const layout = layoutOf(plan)
  const a = layout.folders.findIndex((folder) => folder.id === id)
  const b = layout.folders.findIndex((folder) => folder.id === target.id)
  ;[layout.folders[a], layout.folders[b]] = [layout.folders[b], layout.folders[a]]
  return { ...edits, layout }
}

export function deleteFolder(edits: PlanEdits, id: string): PlanEdits {
  const plan = planOf(edits)
  const week = plan.weeks.find((entry) => entry.id === id)
  if (!week) return edits
  const layout = layoutOf(plan)
  layout.folders = layout.folders.filter((folder) => folder.id !== id)
  return forget({ ...edits, layout }, [id, ...week.sessions.map((session) => session.id)])
}

export function addNode(edits: PlanEdits, folderId: string, fields: NodeFields, index?: number): PlanEdits {
  const layout = layoutOf(planOf(edits))
  const folder = layout.folders.find((entry) => entry.id === folderId)
  if (!folder) return edits
  const id = newId('u', edits.addedNodes)
  folder.nodes.splice(clampIndex(index, folder.nodes.length), 0, id)
  return { ...edits, layout, addedNodes: { ...edits.addedNodes, [id]: { ...fields, id } } }
}

export function updateNode(edits: PlanEdits, id: string, patch: Partial<NodeFields>): PlanEdits {
  if (id in edits.addedNodes) return { ...edits, addedNodes: { ...edits.addedNodes, [id]: { ...edits.addedNodes[id], ...patch, id } } }
  if (!BASE_NODE_IDS.has(id)) return edits
  return { ...edits, nodes: { ...edits.nodes, [id]: { ...edits.nodes[id], ...patch } } }
}

/** Сдвиг занятия внутри своей недели; даты не трогаем — порядок задаёт layout */
export function moveNode(edits: PlanEdits, id: string, delta: number): PlanEdits {
  const layout = layoutOf(planOf(edits))
  const folder = layout.folders.find((entry) => entry.nodes.includes(id))
  if (!folder) return edits
  const from = folder.nodes.indexOf(id)
  const to = from + delta
  if (to < 0 || to >= folder.nodes.length) return edits
  ;[folder.nodes[from], folder.nodes[to]] = [folder.nodes[to], folder.nodes[from]]
  return { ...edits, layout }
}

export function moveNodeToFolder(edits: PlanEdits, id: string, folderId: string, index?: number): PlanEdits {
  const plan = planOf(edits)
  const week = plan.weeks.find((entry) => entry.id === folderId)
  const session = plan.sessions.find((entry) => entry.id === id)
  if (!week || !session) return edits
  const layout = layoutOf(plan)
  for (const folder of layout.folders) folder.nodes = folder.nodes.filter((nodeId) => nodeId !== id)
  const folder = layout.folders.find((entry) => entry.id === folderId)
  if (!folder) return edits
  folder.nodes.splice(clampIndex(index, folder.nodes.length), 0, id)
  const next = { ...edits, layout }
  // Дата вне новой недели — ставим её первый день, иначе занятие по календарю «уедет» из своей карточки
  return session.date < week.from || session.date > week.to ? updateNode(next, id, { date: week.from }) : next
}

/** Обмен позициями и датами двух занятий — в том числе из разных недель */
export function swapNodes(edits: PlanEdits, idA: string, idB: string): PlanEdits {
  if (idA === idB) return edits
  const plan = planOf(edits)
  const a = plan.sessions.find((entry) => entry.id === idA)
  const b = plan.sessions.find((entry) => entry.id === idB)
  if (!a || !b) return edits
  const layout = layoutOf(plan)
  for (const folder of layout.folders) folder.nodes = folder.nodes.map((id) => (id === idA ? idB : id === idB ? idA : id))
  return updateNode(updateNode({ ...edits, layout }, idA, { date: b.date }), idB, { date: a.date })
}

export function deleteNode(edits: PlanEdits, id: string): PlanEdits {
  const plan = planOf(edits)
  if (!plan.sessions.some((session) => session.id === id)) return edits
  const layout = layoutOf(plan)
  for (const folder of layout.folders) folder.nodes = folder.nodes.filter((nodeId) => nodeId !== id)
  return forget({ ...edits, layout }, [id])
}

export function resetEdits(): PlanEdits {
  return EMPTY_EDITS
}

/** Даты для новой недели: ближайший понедельник после последней недели плана и ещё шесть дней */
export function nextWeekRange(weeks: PlanWeek[]): { from: string; to: string } {
  const lastTo = weeks.reduce((max, week) => (week.to > max ? week.to : max), weeks[0]?.to ?? todayISO())
  let from = addDays(lastTo, 1)
  while (parseISO(from).getDay() !== 1) from = addDays(from, 1)
  return { from, to: addDays(from, 6) }
}
