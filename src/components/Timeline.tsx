import { Fragment, useRef, type CSSProperties } from 'react'
import { useScrollFade } from './useScrollFade'
import { CHECKS } from '../data/checks'
import { BLOCKS, CORE_END, RETURN_DATE, WEEKS, type BlockId } from '../data/plan'
import { fmtDate, MONTHS_SHORT, parseISO, todayISO } from '../dates'
import type { PlanWeek } from '../planEdits'
import { blockProgress, percentOf, planOf } from '../progress'
import type { AppState } from '../storage'

interface TimelineProps {
  state: AppState
}

const BLOCK_MODIFIER: Record<BlockId, string> = { A: 'block-a', B: 'block-b', C: 'block-c' }

/** Границы блока по датам его недель в итоговом плане; undefined — недель у блока не осталось */
function blockRange(weeks: PlanWeek[], blockId: BlockId): { from: string; to: string } | undefined {
  const own = weeks.filter((week) => week.block === blockId)
  if (own.length === 0) return undefined
  // По минимуму и максимуму, а не по краям списка: после перестановки недель порядок в плане и порядок дат расходятся
  return { from: own.reduce((min, week) => (week.from < min ? week.from : min), own[0].from), to: own.reduce((max, week) => (week.to > max ? week.to : max), own[0].to) }
}

/** Блок, в чью неделю попадает дата (нужно, чтобы поставить ромб экзамена в свою полосу) */
function blockOf(weeks: PlanWeek[], date: string): BlockId {
  return weeks.find((week) => week.from <= date && date <= week.to)?.block ?? 'C'
}

export function Timeline({ state }: TimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const fade = useScrollFade(scrollRef)
  const viewportClass = ['timeline__viewport', fade.start ? 'timeline__viewport--fade-start' : '', fade.end ? 'timeline__viewport--fade-end' : '']
    .filter(Boolean)
    .join(' ')
  const { weeks } = planOf(state)
  // Если владелец удалил все недели, шкала всё равно начинается с исходного старта плана
  const planStart = weeks.length > 0 ? weeks.reduce((min, week) => (week.from < min ? week.from : min), weeks[0].from) : WEEKS[0].from
  const start = parseISO(planStart)
  const end = parseISO(RETURN_DATE)
  const span = end.getTime() - start.getTime()
  const positionOf = (iso: string) =>
    Math.min(100, Math.max(0, ((parseISO(iso).getTime() - start.getTime()) / span) * 100))

  const months: { label: string; x: number }[] = []
  const cursor = new Date(start.getFullYear(), start.getMonth() + 1, 1)
  while (cursor <= end) {
    months.push({ label: MONTHS_SHORT[cursor.getMonth()], x: positionOf(`${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-01`) })
    cursor.setMonth(cursor.getMonth() + 1)
  }

  const exams = CHECKS.filter((check) => check.id.startsWith('exam')).map((check, index) => ({
    ...check,
    number: index + 1,
    block: blockOf(weeks, check.date),
  }))

  const today = todayISO()
  const showToday = today >= planStart && today <= RETURN_DATE

  return (
    <figure className="timeline">
      <figcaption className="timeline__caption">
        <h2>Календарь</h2>
        <p className="section-lead">
          Полосы — сроки блоков, заливка внутри показывает сделанное; ромбы — пробные экзамены. Проверки идут каждую субботу и на шкалу не вынесены.
        </p>
      </figcaption>

      {/* График декоративен для скринридера — то же содержание словами */}
      <p className="visually-hidden">
        {BLOCKS.map((block) => {
          const range = blockRange(weeks, block.id)
          const dates = range ? `${fmtDate(range.from)} — ${fmtDate(range.to)}` : 'недель нет'
          return `Блок ${block.id}: ${dates}, сделано ${percentOf(blockProgress(block.id, state))} %. `
        }).join('')}
        Основной план заканчивается 22 ноября.
      </p>

      <div className={viewportClass}>
      <div className="timeline__scroll" ref={scrollRef}>
        <div className="timeline__chart" style={{ '--timeline-rows': BLOCKS.length } as CSSProperties} aria-hidden="true">
          <div className="timeline__months">
            {months.map((month) => (
              <span className="timeline__month" key={`${month.label}-${month.x}`} style={{ insetInlineStart: `${month.x}%` }}>
                {month.label}
              </span>
            ))}
            <span className="timeline__month timeline__month--end" style={{ insetInlineStart: `${positionOf(CORE_END)}%` }}>
              итог · 22 ноя
            </span>
            {showToday && (
              <span className="timeline__month timeline__month--today" style={{ insetInlineStart: `${positionOf(today)}%` }}>
                сегодня
              </span>
            )}
          </div>

          {BLOCKS.map((block) => {
            const range = blockRange(weeks, block.id)
            const left = range ? positionOf(range.from) : 0
            const width = range ? positionOf(range.to) - left : 0
            const percent = percentOf(blockProgress(block.id, state))
            const modifier = BLOCK_MODIFIER[block.id]
            return (
              <Fragment key={block.id}>
                <span className="timeline__row-label">Блок {block.id}</span>
                <div className="timeline__row">
                  {range && (
                    <span className={`timeline__bar timeline__bar--${modifier}`} style={{ insetInlineStart: `${left}%`, width: `${width}%` }}>
                      <span className={`timeline__fill timeline__fill--${modifier}`} style={{ width: `${percent}%` }} />
                    </span>
                  )}
                  {exams
                    .filter((exam) => exam.block === block.id)
                    .map((exam) => (
                      <span className="timeline__milestone" key={exam.id} style={{ insetInlineStart: `${positionOf(exam.date)}%` }}>
                        <span className="timeline__milestone-marker" />
                        <span className="timeline__milestone-number">{exam.number}</span>
                      </span>
                    ))}
                </div>
              </Fragment>
            )
          })}
        </div>
      </div>
      </div>

      <ol className="milestone-legend">
        {exams.map((exam) => (
          <li className="milestone-legend__item" key={exam.id}>
            <span className={`milestone-legend__number milestone-legend__number--${BLOCK_MODIFIER[exam.block]}`}>{exam.number}</span>
            <span>
              {exam.title} · {exam.scope}
            </span>
            <time className="milestone-legend__date" dateTime={exam.date}>
              {fmtDate(exam.date)}
            </time>
          </li>
        ))}
      </ol>
    </figure>
  )
}
