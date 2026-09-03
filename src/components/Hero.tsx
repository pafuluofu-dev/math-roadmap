import { CORE_END, PLANNED_HOURS, RETURN_DATE } from '../data/plan'
import { daysUntil, fmtHours, todayISO } from '../dates'
import { overallProgress, percentOf } from '../progress'
import type { AppState } from '../storage'
import { AnimatedNumber } from './AnimatedNumber'

interface HeroProps {
  state: AppState
}

export function Hero({ state }: HeroProps) {
  const progress = overallProgress(state)
  const percent = percentOf(progress)
  const coreEndAhead = todayISO() < CORE_END

  const stats: { value: number; format?: (value: number) => string; unit: string; label: string }[] = [
    { value: daysUntil(RETURN_DATE), unit: 'дн', label: 'до возвращения · 9 февраля 2027' },
  ]
  if (coreEndAhead) {
    stats.push({ value: daysUntil(CORE_END), unit: 'дн', label: 'до конца основного плана · 22 ноября 2026' })
  }
  stats.push(
    {
      value: progress.doneMinutes,
      format: (minutes) => fmtHours(minutes / 60),
      unit: 'ч',
      label: `сделано из ≈${PLANNED_HOURS} ч по плану`,
    },
    { value: progress.done, unit: 'зан.', label: `сделано из ${progress.total} занятий` },
  )

  return (
    <header className="hero">
      <p className="eyebrow">Повторение · темы 1–24 · РУТ (МИИТ) 2026</p>
      <h1>Маршрут: математика</h1>
      <p className="hero__lead">
        Повторение первого семестра до возвращения из академотпуска. <strong>Блок А</strong> — разница программы 2026 (недели 1–3), <strong>блок B</strong> —
        повторение сданного (недели 4–12), <strong>блок C</strong> — резерв и второй круг (недели 13–23). Ритм: пн–пт — занятие 60 минут, суббота — самопроверка,
        воскресенье — отдых.
      </p>
      <ul className="hero__stats">
        {stats.map((stat) => (
          <li className="stat-card" key={stat.label}>
            <p className="stat-card__value">
              <AnimatedNumber value={stat.value} format={stat.format} />
              <span className="stat-card__unit">{stat.unit}</span>
            </p>
            <p className="stat-card__label">{stat.label}</p>
          </li>
        ))}
      </ul>
      <span className="progress-bar" role="progressbar" aria-label="Сделано занятий" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
        <span className="progress-bar__fill" style={{ width: `${percent}%` }} />
      </span>
    </header>
  )
}
