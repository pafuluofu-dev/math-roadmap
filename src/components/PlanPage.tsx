import { useState } from 'react'
import { CHECKS } from '../data/checks'
import { BLOCKS, PASS_THRESHOLD, type Block, type BlockId, type Session, type SessionKind, type SessionLink } from '../data/plan'
import { PROGRAM_DOC, RESOURCES } from '../data/resources'
import { fmtRange, todayISO } from '../dates'
import {
  addFolder,
  addNode,
  deleteFolder,
  deleteNode,
  hasEdits,
  moveFolder,
  moveNode,
  moveNodeToFolder,
  nextWeekRange,
  resetEdits,
  swapNodes,
  updateFolder,
  updateNode,
  type EffectivePlan,
  type FolderFields,
  type NodeFields,
  type PlanEdits,
  type PlanWeek,
} from '../planEdits'
import { blockProgress, isMissed, percentOf, planOf, weekProgress } from '../progress'
import type { AppState } from '../storage'
import { ROUTE_META } from '../router'
import { ProgressRing } from './ProgressRing'
import { SessionItem } from './SessionItem'
import { Timeline } from './Timeline'

interface PlanPageProps {
  state: AppState
  onToggleSession: (id: string) => void
  onAddCustom: (week: number, date: string, title: string) => void
  onDeleteCustom: (id: string) => void
  onEditPlan: (edit: (edits: PlanEdits) => PlanEdits) => void
}

const BLOCK_COLOR: Record<Block['id'], string> = {
  A: 'var(--color-block-a)',
  B: 'var(--color-block-b)',
  C: 'var(--color-text-muted)',
}

/** Какая форма редактора раскрыта — одна на всю страницу */
type EditorForm = { kind: 'node'; id: string } | { kind: 'new-node'; folderId: string } | { kind: 'folder'; id: string } | { kind: 'new-folder'; block: BlockId }

/** Режим редактирования: состояние страницы, которое получают блоки, недели и занятия. undefined — режим выключен */
interface Editor {
  plan: EffectivePlan
  form: EditorForm | null
  setForm: (form: EditorForm | null) => void
  /** Первое занятие, выбранное для обмена «⇄» */
  swapFrom: string | null
  setSwapFrom: (id: string | null) => void
  apply: (edit: (edits: PlanEdits) => PlanEdits) => void
}

export function PlanPage({ state, onToggleSession, onAddCustom, onDeleteCustom, onEditPlan }: PlanPageProps) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<EditorForm | null>(null)
  const [swapFrom, setSwapFrom] = useState<string | null>(null)
  const plan = planOf(state)
  const editor: Editor | undefined = editing ? { plan, form, setForm, swapFrom, setSwapFrom, apply: onEditPlan } : undefined

  const toggleEditing = () => {
    setEditing((previous) => !previous)
    setForm(null)
    setSwapFrom(null)
  }

  const reset = () => {
    if (!window.confirm('Вернуть исходный план? Все правки — порядок, свои недели и занятия, изменённые поля, удаления — будут стёрты. Галочки останутся.')) return
    onEditPlan(resetEdits)
    setForm(null)
    setSwapFrom(null)
  }

  return (
    <main className="plan-page">
      <h1 className="visually-hidden">План повторения</h1>
      <p className="plan-page__context">
        Ритм: <strong>пн–пт — одно занятие 60 минут</strong>, суббота — самопроверка, воскресенье — отдых. Основной план — недели 1–12 (02.09 → 22.11), недели
        13–23 — резерв. Неделя сворачивается, когда все её занятия отмечены. <a href={ROUTE_META.home.hash}>Прогресс и «Сегодня» — на обзоре</a>.
      </p>
      <div className="plan-editor">
        <button type="button" className={`button${editing ? ' button--active' : ''}`} aria-pressed={editing} onClick={toggleEditing}>
          {editing ? 'Готово' : 'Редактировать план'}
        </button>
        {editing && <p className="plan-editor__hint">Правки хранятся в этом браузере и попадают в экспорт.</p>}
        {editing && hasEdits(state.planEdits) && (
          <button type="button" className="link-button" onClick={reset}>
            Вернуть исходный план
          </button>
        )}
        {editing && swapFrom && (
          <p className="plan-editor__notice" role="status">
            Выберите второй элемент для обмена.
            <button type="button" className="link-button" onClick={() => setSwapFrom(null)}>
              Отменить
            </button>
          </p>
        )}
      </div>
      <Timeline state={state} />
      {BLOCKS.map((block) => (
        <BlockSection
          key={block.id}
          block={block}
          state={state}
          editor={editor}
          onToggleSession={onToggleSession}
          onAddCustom={onAddCustom}
          onDeleteCustom={onDeleteCustom}
        />
      ))}
      <ResourcesSection />
    </main>
  )
}

interface BlockSectionProps {
  block: Block
  state: AppState
  editor?: Editor
  onToggleSession: (id: string) => void
  onAddCustom: (week: number, date: string, title: string) => void
  onDeleteCustom: (id: string) => void
}

function BlockSection({ block, state, editor, onToggleSession, onAddCustom, onDeleteCustom }: BlockSectionProps) {
  const progress = blockProgress(block.id, state)
  const percent = percentOf(progress)
  // Принадлежность недели блоку — из итогового плана, а не из BLOCKS[].weeks: владелец мог переставить или добавить недели
  const weeks = planOf(state).weeks.filter((week) => week.block === block.id)
  const first = weeks[0]
  const last = weeks[weeks.length - 1]
  const titleId = `block-${block.id.toLowerCase()}-title`
  const weakTopics =
    block.id === 'C'
      ? CHECKS.filter((check) => {
          const result = state.checks[check.id]
          return result && result.score < check.threshold
        })
      : []
  const newFolderOpen = editor?.form?.kind === 'new-folder' && editor.form.block === block.id

  const saveFolder = (fields: FolderFields) => {
    if (!editor) return
    // Новая неделя встаёт в конец своего блока; если выбранный блок пуст — в конец плана
    const tail = editor.plan.weeks.filter((week) => week.block === fields.block).pop()
    editor.apply((edits) => addFolder(edits, fields, tail?.id))
    editor.setForm(null)
  }

  return (
    <section className={`plan-block plan-block--${block.id.toLowerCase()}`} aria-labelledby={titleId}>
      <header className="plan-block__header">
        <div className="plan-block__header-main">
          <p className="eyebrow">
            Блок {block.id} · {first && last ? `недели ${first.n}–${last.n}` : 'нет недель'} · ≈{block.hours} ч
          </p>
          <h2 id={titleId} className="plan-block__title">
            {block.title}
          </h2>
          <p className="plan-block__meta">
            <span>
              {progress.done} / {progress.total} занятий · {percent} %
            </span>
          </p>
        </div>
        <ProgressRing percent={percent} color={BLOCK_COLOR[block.id]} label={`Прогресс блока ${block.id}: ${percent} %`} />
      </header>
      {weakTopics.length > 0 && (
        <p className="plan-block__hint">
          Подсказка для второго круга — проверки ниже {PASS_THRESHOLD} %: {weakTopics.map((check) => `${check.title} (${check.scope})`).join(', ')}.
        </p>
      )}
      <div className="weeks">
        {weeks.map((week) => (
          <WeekCard
            key={week.id}
            week={week}
            state={state}
            editor={editor}
            onToggleSession={onToggleSession}
            onAddCustom={onAddCustom}
            onDeleteCustom={onDeleteCustom}
          />
        ))}
        {editor && newFolderOpen && (
          <FolderForm block={block.id} defaults={nextWeekRange(editor.plan.weeks)} onSave={saveFolder} onCancel={() => editor.setForm(null)} />
        )}
        {editor && !newFolderOpen && (
          <div className="weeks__add">
            <button type="button" className="button" onClick={() => editor.setForm({ kind: 'new-folder', block: block.id })}>
              + Добавить неделю
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

interface WeekCardProps {
  week: PlanWeek
  state: AppState
  editor?: Editor
  onToggleSession: (id: string) => void
  onAddCustom: (week: number, date: string, title: string) => void
  onDeleteCustom: (id: string) => void
}

function WeekCard({ week, state, editor, onToggleSession, onAddCustom, onDeleteCustom }: WeekCardProps) {
  const today = todayISO()
  const isCurrent = week.from <= today && today <= week.to
  const progress = weekProgress(week, state)
  const allDone = progress.total > 0 && progress.done === progress.total
  // «Второй круг» привязан к исходному номеру недели; у своих недель его нет
  const custom = state.custom.filter((entry) => entry.week === week.baseN).sort((a, b) => a.date.localeCompare(b.date))
  const form = editor?.form ?? null
  const folderFormOpen = form?.kind === 'folder' && form.id === week.id
  const newNodeOpen = form?.kind === 'new-node' && form.folderId === week.id
  // Соседи для ↑/↓ — только недели того же блока: порядок в layout общий, а на странице блоки показаны раздельно
  const siblings = editor ? editor.plan.weeks.filter((entry) => entry.block === week.block) : []
  const position = siblings.findIndex((entry) => entry.id === week.id)

  const remove = () => {
    if (!editor) return
    if (!window.confirm(`Удалить неделю ${week.n} «${week.focus}»? Вместе с ней уйдут её занятия: ${week.sessions.length}. Галочки останутся.`)) return
    editor.apply((edits) => deleteFolder(edits, week.id))
    editor.setForm(null)
  }

  const saveNode = (session: Session | undefined, fields: NodeFields, folderId: string) => {
    if (!editor) return
    editor.apply((edits) => {
      if (!session) return addNode(edits, folderId, fields)
      const next = updateNode(edits, session.id, fields)
      return folderId === week.id ? next : moveNodeToFolder(next, session.id, folderId)
    })
    editor.setForm(null)
  }

  return (
    <details className={`week${isCurrent ? ' week--current' : ''}`} open={!allDone || isCurrent || !!editor}>
      <summary className="week__summary">
        <span className="week__name">
          Неделя {week.n} · {fmtRange(week.from, week.to)} · {week.focus}
          {isCurrent && <span className="badge badge--current">текущая</span>}
        </span>
        <span className="week__progress">
          {progress.done}/{progress.total}
        </span>
      </summary>
      {editor && (
        <div className="edit-tools edit-tools--folder">
          <button type="button" className="edit-tools__button" aria-pressed={folderFormOpen} onClick={() => editor.setForm(folderFormOpen ? null : { kind: 'folder', id: week.id })}>
            ✎ Изменить
          </button>
          <button
            type="button"
            className="edit-tools__button"
            aria-label="Переместить неделю выше"
            disabled={position <= 0}
            onClick={() => editor.apply((edits) => moveFolder(edits, week.id, -1))}
          >
            ↑
          </button>
          <button
            type="button"
            className="edit-tools__button"
            aria-label="Переместить неделю ниже"
            disabled={position < 0 || position >= siblings.length - 1}
            onClick={() => editor.apply((edits) => moveFolder(edits, week.id, 1))}
          >
            ↓
          </button>
          <button type="button" className="edit-tools__button" aria-pressed={newNodeOpen} onClick={() => editor.setForm(newNodeOpen ? null : { kind: 'new-node', folderId: week.id })}>
            + Добавить занятие
          </button>
          <button type="button" className="edit-tools__button" onClick={remove}>
            × Удалить
          </button>
        </div>
      )}
      {editor && folderFormOpen && (
        <FolderForm
          block={week.block}
          week={week}
          onSave={(fields) => {
            editor.apply((edits) => updateFolder(edits, week.id, fields))
            editor.setForm(null)
          }}
          onCancel={() => editor.setForm(null)}
        />
      )}
      {week.note && <p className="week__note">{week.note}</p>}
      {week.sessions.length + custom.length > 0 || newNodeOpen ? (
        <ol className="week__sessions">
          {week.sessions.map((session, index) =>
            editor && form?.kind === 'node' && form.id === session.id ? (
              <NodeForm
                key={session.id}
                weeks={editor.plan.weeks}
                folderId={week.id}
                session={session}
                onSave={(fields, folderId) => saveNode(session, fields, folderId)}
                onCancel={() => editor.setForm(null)}
              />
            ) : (
              <SessionItem
                key={session.id}
                id={session.id}
                date={session.date}
                kind={session.kind}
                title={session.title}
                minutes={session.minutes}
                notes={session.notes}
                links={session.links}
                topics={session.topics}
                questions={session.questions}
                checked={!!state.sessions[session.id]}
                missed={isMissed(session, state)}
                onToggle={onToggleSession}
                tools={editor && <NodeTools session={session} index={index} count={week.sessions.length} editor={editor} />}
              />
            ),
          )}
          {custom.map((session) => (
            <SessionItem
              key={session.id}
              id={session.id}
              date={session.date}
              kind="custom"
              title={session.title}
              minutes={session.minutes}
              checked={!!state.sessions[session.id]}
              missed={session.date < today && !state.sessions[session.id]}
              onToggle={onToggleSession}
              onDelete={onDeleteCustom}
            />
          ))}
          {editor && newNodeOpen && (
            <NodeForm
              key={`new-${week.id}`}
              weeks={editor.plan.weeks}
              folderId={week.id}
              onSave={(fields, folderId) => saveNode(undefined, fields, folderId)}
              onCancel={() => editor.setForm(null)}
            />
          )}
        </ol>
      ) : (
        <p className="week__empty">Пока пусто — добавь занятия второго круга.</p>
      )}
      {week.block === 'C' && week.baseN !== undefined && <ReserveForm week={week} onAddCustom={onAddCustom} />}
    </details>
  )
}

interface NodeToolsProps {
  session: Session
  index: number
  count: number
  editor: Editor
}

/** Ряд инструментов занятия: ↑ ↓ ⇄ ✎ × */
function NodeTools({ session, index, count, editor }: NodeToolsProps) {
  const swapping = editor.swapFrom === session.id

  const swap = () => {
    const first = editor.swapFrom
    if (!first) editor.setSwapFrom(session.id)
    else if (first === session.id) editor.setSwapFrom(null)
    else {
      editor.apply((edits) => swapNodes(edits, first, session.id))
      editor.setSwapFrom(null)
    }
  }

  const remove = () => {
    if (!window.confirm(`Удалить занятие «${session.title}»? Галочка, если была, останется в хранилище.`)) return
    editor.apply((edits) => deleteNode(edits, session.id))
    if (editor.swapFrom === session.id) editor.setSwapFrom(null)
  }

  return (
    <div className={`edit-tools ${session.kind === 'rest' ? 'edit-tools--rest' : 'edit-tools--node'}`}>
      <button
        type="button"
        className="edit-tools__button"
        aria-label="Переместить занятие выше"
        disabled={index === 0}
        onClick={() => editor.apply((edits) => moveNode(edits, session.id, -1))}
      >
        ↑
      </button>
      <button
        type="button"
        className="edit-tools__button"
        aria-label="Переместить занятие ниже"
        disabled={index >= count - 1}
        onClick={() => editor.apply((edits) => moveNode(edits, session.id, 1))}
      >
        ↓
      </button>
      <button type="button" className="edit-tools__button" aria-label="Поменять местами" aria-pressed={swapping} onClick={swap}>
        ⇄
      </button>
      <button type="button" className="edit-tools__button" aria-label="Изменить занятие" onClick={() => editor.setForm({ kind: 'node', id: session.id })}>
        ✎
      </button>
      <button type="button" className="edit-tools__button" aria-label="Удалить занятие" onClick={remove}>
        ×
      </button>
    </div>
  )
}

const KIND_OPTIONS: { value: SessionKind; label: string }[] = [
  { value: 'study', label: 'занятие' },
  { value: 'diagnostic', label: 'диагностика' },
  { value: 'check', label: 'проверка' },
  { value: 'exam', label: 'экзамен' },
  { value: 'rest', label: 'отдых' },
]

/** Ссылки в поле — по одной в строке «подпись | url»; строка без разделителя — адрес и подпись сразу */
function parseLinks(text: string): SessionLink[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, url] = line.split('|').map((part) => part.trim())
      return url ? { label, url } : { label: line, url: line }
    })
}

function formatLinks(links?: SessionLink[]): string {
  return (links ?? []).map((link) => `${link.label} | ${link.url}`).join('\n')
}

interface NodeFormProps {
  weeks: PlanWeek[]
  folderId: string
  /** Существующее занятие; undefined — новое в конце недели */
  session?: Session
  onSave: (fields: NodeFields, folderId: string) => void
  onCancel: () => void
}

/* Форма занятия на месте узла. topics/questions в форме нет — они уходят в патч нетронутыми,
   потому что patch содержит только поля формы. Пустые пояснение и ссылки сохраняем как '' и [],
   а не undefined: undefined выпадает из JSON и не перекрыл бы исходное значение после перезагрузки */
function NodeForm({ weeks, folderId, session, onSave, onCancel }: NodeFormProps) {
  const week = weeks.find((entry) => entry.id === folderId)
  const today = todayISO()
  const defaultDate = week && week.from <= today && today <= week.to ? today : (week?.from ?? today)
  const [title, setTitle] = useState(session?.title ?? '')
  const [kind, setKind] = useState<SessionKind>(session?.kind ?? 'study')
  const [date, setDate] = useState(session?.date ?? defaultDate)
  const [minutes, setMinutes] = useState(String(session?.minutes ?? 60))
  const [notes, setNotes] = useState(session?.notes ?? '')
  const [links, setLinks] = useState(formatLinks(session?.links))
  const [folder, setFolder] = useState(folderId)
  const prefix = `node-form-${session?.id ?? `new-${folderId}`}`
  const minutesValue = Number(minutes)
  const ready = !!title.trim() && !!date && Number.isFinite(minutesValue) && minutesValue >= 0

  const submit = () => {
    if (!ready) return
    onSave({ title: title.trim(), kind, date, minutes: Math.round(minutesValue), notes: notes.trim(), links: parseLinks(links) }, folder)
  }

  return (
    <li className="node-editor">
      <form
        className="node-editor__form"
        onSubmit={(event) => {
          event.preventDefault()
          submit()
        }}
      >
        <div className="node-editor__field node-editor__field--grow">
          <label className="node-editor__label" htmlFor={`${prefix}-title`}>
            Название
          </label>
          <input className="node-editor__input" id={`${prefix}-title`} type="text" value={title} onChange={(event) => setTitle(event.target.value)} />
        </div>
        <div className="node-editor__field">
          <label className="node-editor__label" htmlFor={`${prefix}-kind`}>
            Тип
          </label>
          <select className="node-editor__input" id={`${prefix}-kind`} value={kind} onChange={(event) => setKind(event.target.value as SessionKind)}>
            {KIND_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="node-editor__field">
          <label className="node-editor__label" htmlFor={`${prefix}-date`}>
            Дата
          </label>
          <input className="node-editor__input" id={`${prefix}-date`} type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </div>
        <div className="node-editor__field">
          <label className="node-editor__label" htmlFor={`${prefix}-minutes`}>
            Минуты
          </label>
          <input className="node-editor__input" id={`${prefix}-minutes`} type="number" min={0} step={5} value={minutes} onChange={(event) => setMinutes(event.target.value)} />
        </div>
        <div className="node-editor__field node-editor__field--grow">
          <label className="node-editor__label" htmlFor={`${prefix}-folder`}>
            Неделя
          </label>
          <select className="node-editor__input" id={`${prefix}-folder`} value={folder} onChange={(event) => setFolder(event.target.value)}>
            {weeks.map((entry) => (
              <option key={entry.id} value={entry.id}>
                Неделя {entry.n} · {fmtRange(entry.from, entry.to)} · {entry.focus}
              </option>
            ))}
          </select>
        </div>
        <div className="node-editor__field node-editor__field--wide">
          <label className="node-editor__label" htmlFor={`${prefix}-notes`}>
            Пояснение
          </label>
          <textarea className="node-editor__input" id={`${prefix}-notes`} rows={2} value={notes} onChange={(event) => setNotes(event.target.value)} />
        </div>
        <div className="node-editor__field node-editor__field--wide">
          <label className="node-editor__label" htmlFor={`${prefix}-links`}>
            Ссылки — по одной в строке: подпись | адрес
          </label>
          <textarea className="node-editor__input" id={`${prefix}-links`} rows={2} value={links} onChange={(event) => setLinks(event.target.value)} />
        </div>
        <div className="node-editor__actions">
          <button type="submit" className="button" disabled={!ready}>
            Сохранить
          </button>
          <button type="button" className="link-button" onClick={onCancel}>
            Отменить
          </button>
        </div>
      </form>
    </li>
  )
}

interface FolderFormProps {
  block: BlockId
  /** Существующая неделя; undefined — новая в конце блока */
  week?: PlanWeek
  /** Даты по умолчанию для новой недели */
  defaults?: { from: string; to: string }
  onSave: (fields: FolderFields) => void
  onCancel: () => void
}

function FolderForm({ block, week, defaults, onSave, onCancel }: FolderFormProps) {
  const [blockId, setBlockId] = useState<BlockId>(week?.block ?? block)
  const [from, setFrom] = useState(week?.from ?? defaults?.from ?? '')
  const [to, setTo] = useState(week?.to ?? defaults?.to ?? '')
  const [focus, setFocus] = useState(week?.focus ?? '')
  const [note, setNote] = useState(week?.note ?? '')
  const prefix = `folder-form-${week?.id ?? `new-${block}`}`
  const ready = !!from && !!to && from <= to && !!focus.trim()

  const submit = () => {
    if (!ready) return
    onSave({ block: blockId, from, to, focus: focus.trim(), note: note.trim() })
  }

  return (
    <form
      className={`folder-editor${week ? '' : ' folder-editor--new'}`}
      onSubmit={(event) => {
        event.preventDefault()
        submit()
      }}
    >
      <div className="folder-editor__field">
        <label className="folder-editor__label" htmlFor={`${prefix}-block`}>
          Блок
        </label>
        <select className="folder-editor__input" id={`${prefix}-block`} value={blockId} onChange={(event) => setBlockId(event.target.value as BlockId)}>
          {BLOCKS.map((entry) => (
            <option key={entry.id} value={entry.id}>
              Блок {entry.id}
            </option>
          ))}
        </select>
      </div>
      <div className="folder-editor__field">
        <label className="folder-editor__label" htmlFor={`${prefix}-from`}>
          С
        </label>
        <input className="folder-editor__input" id={`${prefix}-from`} type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
      </div>
      <div className="folder-editor__field">
        <label className="folder-editor__label" htmlFor={`${prefix}-to`}>
          По
        </label>
        <input className="folder-editor__input" id={`${prefix}-to`} type="date" value={to} min={from || undefined} onChange={(event) => setTo(event.target.value)} />
      </div>
      <div className="folder-editor__field folder-editor__field--grow">
        <label className="folder-editor__label" htmlFor={`${prefix}-focus`}>
          Фокус недели
        </label>
        <input
          className="folder-editor__input"
          id={`${prefix}-focus`}
          type="text"
          value={focus}
          placeholder="Например: пределы и производные ещё раз"
          onChange={(event) => setFocus(event.target.value)}
        />
      </div>
      <div className="folder-editor__field folder-editor__field--wide">
        <label className="folder-editor__label" htmlFor={`${prefix}-note`}>
          Пометка (необязательно)
        </label>
        <textarea className="folder-editor__input" id={`${prefix}-note`} rows={2} value={note} onChange={(event) => setNote(event.target.value)} />
      </div>
      <div className="folder-editor__actions">
        <button type="submit" className="button" disabled={!ready}>
          Сохранить
        </button>
        <button type="button" className="link-button" onClick={onCancel}>
          Отменить
        </button>
      </div>
    </form>
  )
}

interface ReserveFormProps {
  week: PlanWeek
  onAddCustom: (week: number, date: string, title: string) => void
}

/** «Второй круг»: добавить своё занятие в резервную неделю. Привязка — к исходному номеру недели, не к позиционному */
function ReserveForm({ week, onAddCustom }: ReserveFormProps) {
  const today = todayISO()
  const defaultDate = week.from <= today && today <= week.to ? today : week.from
  const [date, setDate] = useState(defaultDate)
  const [title, setTitle] = useState('')
  const n = week.baseN ?? week.n
  const dateId = `custom-date-${n}`
  const titleId = `custom-title-${n}`

  const submit = () => {
    const trimmed = title.trim()
    if (!trimmed || !date) return
    onAddCustom(n, date, trimmed)
    setTitle('')
  }

  return (
    <form
      className="reserve-form"
      onSubmit={(event) => {
        event.preventDefault()
        submit()
      }}
    >
      <div className="reserve-form__field">
        <label className="reserve-form__label" htmlFor={dateId}>
          Дата
        </label>
        <input
          className="reserve-form__input"
          id={dateId}
          type="date"
          value={date}
          min={week.from}
          max={week.to}
          onChange={(event) => setDate(event.target.value)}
        />
      </div>
      <div className="reserve-form__field reserve-form__field--grow">
        <label className="reserve-form__label" htmlFor={titleId}>
          Тема занятия
        </label>
        <input
          className="reserve-form__input"
          id={titleId}
          type="text"
          value={title}
          placeholder="Например: определители 4-го порядка ещё раз"
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>
      <button type="submit" className="button" disabled={!title.trim()}>
        Добавить занятие
      </button>
    </form>
  )
}

function ResourcesSection() {
  return (
    <section className="page-section" aria-labelledby="resources-title">
      <div className="page-section__header">
        <h2 id="resources-title">Материалы</h2>
      </div>
      <p className="resources__source">
        <a className="resources__source-link" href={PROGRAM_DOC.url} target="_blank" rel="noopener noreferrer">
          {PROGRAM_DOC.title}
          <span aria-hidden="true"> ↗</span>
          <span className="visually-hidden"> (PDF, откроется в новой вкладке)</span>
        </a>
        <span className="resources__note">
          {' '}
          — PDF, {PROGRAM_DOC.pages} страниц: {PROGRAM_DOC.note}
        </span>
      </p>
      <ul className="resources">
        {RESOURCES.map((resource) => (
          <li className="resources__item" key={resource.title}>
            {resource.url ? <a href={resource.url}>{resource.title}</a> : <span>{resource.title}</span>}
            <span className="resources__note"> — {resource.note}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
