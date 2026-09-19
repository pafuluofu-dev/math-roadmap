import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { Check } from '../data/checks'
import type { TestItem } from '../data/testBank'
import { fmtDateYear } from '../dates'
import { MathText } from './MathFormula'

interface PrintSheetProps {
  check: Check
  items: TestItem[]
  /** Диалог печати закрыт — напечатали или отменили, лист больше не нужен */
  onDone: () => void
}

/**
 * Лист контрольной для принтера: только условия, без ответов.
 * Живёт в DOM ровно на время диалога печати. Монтируется через портал в body, чтобы
 * печатные стили могли спрятать всё остальное одним правилом.
 * Модуль отдельный и грузится отложенно: он тянет KaTeX, а «Проверки» без него открываются быстрее.
 */
export function PrintSheet({ check, items, onDone }: PrintSheetProps) {
  const sheetRef = useRef<HTMLElement>(null)
  const problems = items.filter((item) => item.kind === 'problem').length
  const theory = items.length - problems
  const siteUrl = `${window.location.origin}${window.location.pathname}#/checks`

  useEffect(() => {
    let cancelled = false
    document.documentElement.classList.add('is-printing')
    window.addEventListener('afterprint', onDone)

    // Эффект идёт уже после коммита разметки. Замер размеров заставляет браузер сделать раскладку
    // и запросить шрифты KaTeX для листа за кадром; ждём их — напечатать раньше значит получить
    // формулы запасным шрифтом. Без requestAnimationFrame: в фоновой вкладке кадры могут не прийти.
    sheetRef.current?.getBoundingClientRect()
    document.fonts.ready.then(() => {
      if (!cancelled) window.print()
    })

    return () => {
      cancelled = true
      window.removeEventListener('afterprint', onDone)
      document.documentElement.classList.remove('is-printing')
    }
  }, [onDone])

  return createPortal(
    <section className="print-sheet" ref={sheetRef} aria-hidden="true">
      <header className="print-sheet__head">
        <h1 className="print-sheet__title">{check.title}</h1>
        <p className="print-sheet__meta">
          {fmtDateYear(check.date)} · {check.format} · порог {check.threshold} %
        </p>
        <p className="print-sheet__scope">{check.scope}</p>
        <p className="print-sheet__fields">
          <span className="print-sheet__field">
            Дата <span className="print-sheet__blank" />
          </span>
          <span className="print-sheet__field">
            Баллы <span className="print-sheet__blank print-sheet__blank--short" /> / 100
          </span>
        </p>
      </header>

      <ol className="print-sheet__list">
        {items.map((item) => (
          <li className={`print-sheet__task${item.kind === 'theory' ? ' print-sheet__task--theory' : ''}`} key={item.id}>
            <p className="print-sheet__task-head">
              <span className="print-sheet__task-id">{item.id}</span>
              <span className="print-sheet__task-title">{item.title}</span>
              {item.kind === 'theory' && <span className="print-sheet__kind">теория</span>}
            </p>
            <MathText as="div" className="print-sheet__prompt" text={item.prompt} />
          </li>
        ))}
      </ol>

      <footer className="print-sheet__foot">
        В банке {problems} {theory > 0 ? `+ ${theory} теории` : ''} — на листе все; формат самой проверки указан в шапке. Ответы и ключи — на сайте:{' '}
        {siteUrl}
      </footer>
    </section>,
    document.body,
  )
}
