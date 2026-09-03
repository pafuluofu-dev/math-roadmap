import { DIFFERENCE_FOOTNOTE, DIFFERENCE_ITEMS } from '../data/difference'

/** «Разница»: что есть в программе 2026 и чего не было на зачёте в декабре 2025 */
export function DifferenceSection() {
  return (
    <section className="page-section" aria-labelledby="difference-title">
      <div className="page-section__header">
        <h2 id="difference-title">Что есть в 1-м семестре 2026 и чего не было на зачёте в декабре 2025</h2>
      </div>
      <ol className="difference">
        {DIFFERENCE_ITEMS.map((item) => (
          <li className="difference__item" key={item.text}>
            <span className="difference__text">{item.text}</span>
            <span className="difference__hours">{item.hours}</span>
          </li>
        ))}
      </ol>
      <p className="difference__footnote">{DIFFERENCE_FOOTNOTE}</p>
    </section>
  )
}
