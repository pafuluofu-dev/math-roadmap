import type { TestItem } from '../data/testBank'
import { MathText } from './MathFormula'

/** Отдельный модуль: единственное место на «Проверках», которому нужен KaTeX, — грузится отложенно из ChecksPage */
export function TestTasksList({ items }: { items: TestItem[] }) {
  return (
    <ol className="test-list">
      {items.map((item) => (
        <li className={`test-item${item.kind === 'theory' ? ' test-item--theory' : ''}`} key={item.id}>
          <p className="test-item__head">
            <span className="test-item__id">{item.id}</span>
            <span className="test-item__title">{item.title}</span>
            {item.kind === 'theory' && <span className="test-item__kind">теория</span>}
          </p>
          <MathText as="div" className="test-item__prompt" text={item.prompt} />
          {item.answer ? (
            <details className="test-item__answer-fold">
              <summary className="test-item__answer-summary">{item.kind === 'theory' ? 'Показать ключ' : 'Показать ответ'}</summary>
              <MathText as="div" className="test-item__answer" text={item.answer} />
            </details>
          ) : (
            <p className="test-item__no-key">Ключ не задан — сверьтесь с конспектом или разделом «Формулы».</p>
          )}
        </li>
      ))}
    </ol>
  )
}
