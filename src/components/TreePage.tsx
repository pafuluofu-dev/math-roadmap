import { useMemo, useState } from 'react'
import { todayISO } from '../dates'
import { planOf } from '../progress'
import type { AppState } from '../storage'
import { buildTree, type TreeNode } from '../tree'
import { treeToSvg } from '../treeSvg'

interface TreePageProps {
  state: AppState
}

const MARKER: Record<'done' | 'current' | 'muted' | 'plain', { sign: string; text: string }> = {
  done: { sign: '✓', text: 'сделано' },
  current: { sign: '◐', text: 'идёт сейчас' },
  muted: { sign: '○', text: 'без отметки' },
  plain: { sign: '●', text: '' },
}

/** Дерево целиком строится из данных: правки владельца уже в плане, галочки — в состоянии */
export function TreePage({ state }: TreePageProps) {
  const tree = useMemo(() => buildTree(planOf(state), state), [state])
  const [hideDone, setHideDone] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  // details раскрывает сам браузер, поэтому «Свернуть всё» перемонтирует список — иначе часть веток останется как была
  const [foldVersion, setFoldVersion] = useState(0)
  const [message, setMessage] = useState('')

  const visibleRoots = hideDone && tree.status === 'done' ? [] : [tree]

  const download = () => {
    const blob = new Blob([treeToSvg(tree, { hideDone })], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `math-roadmap-tree-${todayISO()}.svg`
    link.click()
    URL.revokeObjectURL(url)
    setMessage('Файл скачан. Откройте его в браузере — можно распечатать или вставить в заметки.')
  }

  const toggleFold = () => {
    setCollapsed((previous) => !previous)
    setFoldVersion((previous) => previous + 1)
  }

  return (
    <main className="tree-page">
      <header className="page-head">
        <p className="eyebrow">Дерево плана · строится из данных</p>
        <h1 className="page-head__title">Дерево</h1>
        <p className="page-head__lead">
          Весь план одной картой: блоки, недели и занятия с отметками. Свернуть ветку — щёлкнуть по заголовку. Кнопка ниже скачивает дерево файлом SVG — его
          можно распечатать или вставить в заметки.
        </p>
      </header>

      <div className="tree-tools">
        <button type="button" className="button" onClick={download}>
          Скачать SVG
        </button>
        <button type="button" className="button" onClick={toggleFold}>
          {collapsed ? 'Развернуть всё' : 'Свернуть всё'}
        </button>
        <label className="tree-tools__filter">
          <input className="checkbox" type="checkbox" checked={hideDone} onChange={(event) => setHideDone(event.target.checked)} />
          Скрыть сделанное
        </label>
      </div>
      {message && (
        <p className="tree-tools__message" role="status">
          {message}
        </p>
      )}

      {visibleRoots.length > 0 ? (
        <ul className="tree" key={foldVersion}>
          {visibleRoots.map((node) => (
            <TreeBranch key={node.id} node={node} hideDone={hideDone} open={!collapsed} />
          ))}
        </ul>
      ) : (
        <p className="tree__empty">Сделано всё — снимите галочку «Скрыть сделанное», чтобы увидеть план целиком.</p>
      )}
    </main>
  )
}

interface TreeBranchProps {
  node: TreeNode
  hideDone: boolean
  open: boolean
}

function TreeBranch({ node, hideDone, open }: TreeBranchProps) {
  const children = hideDone ? node.children.filter((child) => child.status !== 'done') : node.children
  const row = <TreeRow node={node} />

  if (!node.folder) {
    return <li className="tree__item tree__item--leaf">{row}</li>
  }

  return (
    <li className="tree__item">
      <details className="tree__folder" open={open}>
        <summary className="tree__summary">{row}</summary>
        {children.length > 0 ? (
          <ul className="tree__list">
            {children.map((child) => (
              <TreeBranch key={child.id} node={child} hideDone={hideDone} open={open} />
            ))}
          </ul>
        ) : (
          <p className="tree__empty">Показывать нечего: всё сделано или занятий нет.</p>
        )}
      </details>
    </li>
  )
}

function TreeRow({ node }: { node: TreeNode }) {
  const marker = MARKER[node.status ?? 'plain']
  const classes = ['tree__row']
  if (node.status) classes.push(`tree__row--${node.status}`)
  if (node.branch) classes.push(`tree__row--branch-${node.branch}`)
  return (
    <span className={classes.join(' ')}>
      <span className="tree__marker" aria-hidden="true">
        {marker.sign}
      </span>
      {marker.text && <span className="visually-hidden">{marker.text}: </span>}
      <span className="tree__label">{node.label}</span>
      {node.meta && <span className="tree__meta">{node.meta}</span>}
    </span>
  )
}
