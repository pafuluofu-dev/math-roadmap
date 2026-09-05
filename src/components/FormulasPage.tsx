import { Fragment, useEffect, useMemo, useState } from 'react'
import { FORMULA_LEGEND, FORMULA_TOPICS, type FormulaTopic } from '../data/formulas'
import { MathFormula, MathText } from './MathFormula'

export const formulaTopicAnchor = (topic: number) => `formula-topic-${topic}`

/** Грубая основа слова: «Лопиталь» → «лопитал» находит «Лопиталя», «определитель» — «Определители» */
function stem(word: string): string {
  return word.length > 4 ? word.slice(0, -1) : word
}

/** Поиск: по номеру темы («12», «тема 12»), названию темы и тексту/LaTeX формул; все слова запроса должны встретиться */
function filterTopics(query: string): FormulaTopic[] {
  const q = query.trim().toLowerCase()
  if (!q) return FORMULA_TOPICS
  const byNumber = q.match(/^(?:тема\s*)?(\d{1,2})$/)
  if (byNumber) return FORMULA_TOPICS.filter((topic) => topic.topic === Number(byNumber[1]))
  const stems = q.split(/\s+/).map(stem)
  const matches = (haystack: string) => {
    const text = haystack.toLowerCase()
    return stems.every((part) => text.includes(part))
  }
  return FORMULA_TOPICS.map((topic) => {
    if (matches(topic.title)) return topic
    const formulas = topic.formulas.filter((formula) => matches(`${formula.name} ${formula.note ?? ''} ${formula.group ?? ''} ${formula.tex}`))
    return { ...topic, formulas }
  }).filter((topic) => topic.formulas.length > 0)
}

/** #/formulas/12 — двенадцатая тема раскрыта; ссылка, которой можно поделиться */
function topicFromHash(): number | null {
  const match = window.location.hash.match(/^#\/formulas\/(\d{1,2})$/)
  const topic = match ? Number(match[1]) : NaN
  return FORMULA_TOPICS.some((item) => item.topic === topic) ? topic : null
}

interface Reveal {
  topic: number
  /** Меняется при каждом клике, иначе повторный клик по той же теме не подведёт к ней */
  nonce: number
}

export function FormulasPage() {
  const [query, setQuery] = useState('')
  const [reveal, setReveal] = useState<Reveal | null>(() => {
    const topic = topicFromHash()
    return topic === null ? null : { topic, nonce: 0 }
  })
  // Что раскрыто без поиска: тема из ссылки, иначе первая
  const [defaultOpen] = useState(() => topicFromHash() ?? FORMULA_TOPICS[0].topic)
  const topics = useMemo(() => filterTopics(query), [query])
  const searching = query.trim() !== ''
  const totalFormulas = FORMULA_TOPICS.reduce((sum, topic) => sum + topic.formulas.length, 0)

  // Раскрыть и подвести к теме — после того, как список перерисован без фильтра
  useEffect(() => {
    if (!reveal) return
    const element = document.getElementById(formulaTopicAnchor(reveal.topic))
    if (!(element instanceof HTMLDetailsElement)) return
    element.open = true
    element.scrollIntoView({ block: 'start' })
    element.querySelector<HTMLElement>('summary')?.focus({ preventScroll: true })
  }, [reveal, topics])

  return (
    <main className="formulas-page">
      <header className="page-head">
        <p className="eyebrow">Шпаргалка · темы 1–24</p>
        <h1 className="page-head__title">Формулы</h1>
        <p className="page-head__lead">
          Формулы сгруппированы по программе первого семестра — {FORMULA_TOPICS.length} тем, {totalFormulas} записей. <MathText text={FORMULA_LEGEND} />
        </p>
      </header>

      <section className="page-section" aria-labelledby="formulas-nav-title">
        <h2 id="formulas-nav-title" className="visually-hidden">
          Поиск и переход по темам
        </h2>
        <div className="formulas-search">
          <label className="formulas-search__label" htmlFor="formulas-query">
            Поиск по теме или формуле
          </label>
          <input
            className="formulas-search__input"
            id="formulas-query"
            type="search"
            autoComplete="off"
            placeholder="определитель, Лопиталь, эллипс, 16…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <nav className="formulas-topics" aria-label="Быстрый переход к теме">
          <ol className="formulas-topics__list">
            {FORMULA_TOPICS.map((topic) => (
              <li key={topic.topic}>
                <button
                  type="button"
                  className="formulas-topics__button"
                  title={topic.title}
                  aria-label={`Тема ${topic.topic}: ${topic.title}`}
                  onClick={() => {
                    setQuery('')
                    setReveal({ topic: topic.topic, nonce: Date.now() })
                  }}
                >
                  {topic.topic}
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </section>

      <section className="page-section" aria-labelledby="formulas-list-title">
        <h2 id="formulas-list-title" className="visually-hidden">
          Формулы по темам
        </h2>
        {topics.length === 0 && <p className="formulas-empty">По запросу «{query.trim()}» ничего не нашлось. Попробуйте номер темы или короче.</p>}
        <div className="formulas-list">
          {topics.map((topic) => (
            <details className="formula-topic" id={formulaTopicAnchor(topic.topic)} key={topic.topic} open={searching || topic.topic === defaultOpen}>
              <summary className="formula-topic__summary">
                <span className="formula-topic__number">Тема {topic.topic}</span>
                <span className="formula-topic__title">{topic.title}</span>
                <span className="formula-topic__count">{topic.formulas.length}</span>
              </summary>
              <ul className="formula-list">
                {topic.formulas.map((formula, formulaIndex) => {
                  const previous = topic.formulas[formulaIndex - 1]
                  const groupStarts = formula.group && formula.group !== previous?.group
                  return (
                    <Fragment key={formula.id}>
                      {groupStarts && <li className="formula-group">{formula.group}</li>}
                      <li className="formula-item">
                        {formula.name && <MathText as="p" className="formula-item__name" text={formula.name} />}
                        {formula.tex && <MathFormula tex={formula.tex} />}
                        {formula.note && <MathText as="p" className="formula-item__note" text={formula.note} />}
                      </li>
                    </Fragment>
                  )
                })}
              </ul>
            </details>
          ))}
        </div>
      </section>
    </main>
  )
}
