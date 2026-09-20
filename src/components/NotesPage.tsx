import { useEffect, useState } from 'react'
import { NOTES, type Note } from '../data/notes'
import { Markdown } from './Markdown'
import { NoteVideos } from './NoteVideos'

export const noteGroupAnchor = (id: number) => `note-group-${id}`
const noteTopicAnchor = (topic: number) => `note-topic-${topic}`

/** Все темы 1–24 по порядку — для полосы быстрого перехода */
const ALL_TOPICS = NOTES.flatMap((note) => note.topics).sort((a, b) => a - b)

function groupOfTopic(topic: number): Note | undefined {
  return NOTES.find((note) => note.topics.includes(topic))
}

/** «#/notes/12» — открыть группу с темой 12 и подвести к её заголовку */
function topicFromHash(): number | null {
  const match = window.location.hash.match(/^#\/notes\/(\d{1,2})$/)
  const topic = match ? Number(match[1]) : NaN
  return groupOfTopic(topic) ? topic : null
}

interface Target {
  group: number
  topic: number | null
  /** Меняется при каждом переходе, иначе повторный клик по той же теме не сработает */
  nonce: number
}

export function NotesPage() {
  const [target, setTarget] = useState<Target>(() => {
    const topic = topicFromHash()
    const group = topic === null ? NOTES[0].id : groupOfTopic(topic)!.id
    return { group, topic, nonce: 0 }
  })

  // Страница остаётся смонтированной при смене «#/notes/5» → «#/notes/18»,
  // поэтому на хэш надо подписаться: иначе ссылка на тему сработает только при первом заходе
  useEffect(() => {
    const onHashChange = () => {
      const topic = topicFromHash()
      if (topic === null) return
      setTarget({ group: groupOfTopic(topic)!.id, topic, nonce: Date.now() })
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  // Подвести к теме после того, как её группа раскрылась и отрисовалась
  useEffect(() => {
    const anchor = target.topic === null ? noteGroupAnchor(target.group) : noteTopicAnchor(target.topic)
    const element = document.getElementById(anchor)
    if (!element) return
    element.scrollIntoView({ block: 'start' })
    const summary = element.closest('details')?.querySelector<HTMLElement>('summary')
    summary?.focus({ preventScroll: true })
  }, [target])

  const totalWords = NOTES.reduce((sum, note) => sum + note.body.split(/\s+/).length, 0)

  return (
    <main className="notes-page">
      <header className="page-head">
        <p className="eyebrow">Конспекты · темы 1–24</p>
        <h1 className="page-head__title">Конспекты</h1>
        <p className="page-head__lead">
          Разбор всех тем первого семестра по рабочей программе: определения, свойства, разобранные примеры, типовые задачи и частые ошибки. {NOTES.length} групп,{' '}
          {ALL_TOPICS.length} тем, примерно {Math.round(totalWords / 1000)} тысяч слов. Открыта одна группа за раз, ссылка вида <code>#/notes/12</code> ведёт
          прямо к теме.
        </p>
      </header>

      <nav className="notes-nav" aria-label="Быстрый переход к теме">
        <ol className="notes-nav__list">
          {ALL_TOPICS.map((topic) => {
            const group = groupOfTopic(topic)!
            return (
              <li key={topic}>
                <button
                  type="button"
                  className={`notes-nav__button${group.id === target.group ? ' notes-nav__button--current' : ''}`}
                  title={group.title}
                  aria-label={`Тема ${topic} — ${group.title}`}
                  onClick={() => setTarget({ group: group.id, topic, nonce: Date.now() })}
                >
                  {topic}
                </button>
              </li>
            )
          })}
        </ol>
      </nav>

      <div className="notes-list">
        {NOTES.map((note) => (
          <NoteCard key={note.id} note={note} open={note.id === target.group} onOpen={() => setTarget({ group: note.id, topic: null, nonce: Date.now() })} />
        ))}
      </div>
    </main>
  )
}

interface NoteCardProps {
  note: Note
  open: boolean
  onOpen: () => void
}

function NoteCard({ note, open, onOpen }: NoteCardProps) {
  const words = note.body.split(/\s+/).length
  const minutes = Math.max(1, Math.round(words / 150))
  const first = note.topics[0]
  const last = note.topics[note.topics.length - 1]

  return (
    <details
      className="note"
      id={noteGroupAnchor(note.id)}
      open={open}
      onToggle={(event) => {
        // Аккордеон: открытая группа одна, поэтому раскрытие сообщаем наверх
        if (event.currentTarget.open && !open) onOpen()
      }}
    >
      <summary className="note__summary">
        <span className="note__topics">Темы {first === last ? first : `${first}–${last}`}</span>
        <span className="note__title">{note.title}</span>
        <span className="note__reading">{minutes} мин</span>
      </summary>
      {open && (
        <div className="note__body">
          <Markdown text={note.body} />
          <NoteVideos topics={note.topics} />
        </div>
      )}
    </details>
  )
}
