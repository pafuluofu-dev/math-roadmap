import type { TreeNode } from './tree'

/* Печатная картинка дерева: детерминированная вёрстка без замеров текста — одна строка на узел,
   отступ по уровню, соединители в две линии. Цвета взяты из светлой темы variables.css
   и заданы числами: файл живёт вне сайта (печать, заметки), переменных CSS там нет. */

const ROW_HEIGHT = 26
const INDENT = 26
const WIDTH = 960
const PADDING = 24
/** Длинные названия режем: ширину текста без замеров не узнать, а вылезать за край нельзя */
const MAX_LABEL = 90

const COLOR = {
  background: '#fefaf3',
  text: '#38291d',
  muted: '#5c4a3a',
  line: '#c9bba6',
  done: '#42763a',
  a: '#a06b33',
  b: '#2f6e68',
  c: '#5c4a3a',
}

interface Row {
  node: TreeNode
  depth: number
  /** Индекс строки родителя — от него идёт соединитель; -1 у корня */
  parent: number
}

function escapeXml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function clip(text: string): string {
  return text.length > MAX_LABEL ? `${text.slice(0, MAX_LABEL - 1)}…` : text
}

/** Обход в глубину с учётом фильтра: сделанный узел уходит вместе со своей веткой */
function flatten(node: TreeNode, depth: number, parent: number, hideDone: boolean, rows: Row[]): void {
  if (hideDone && node.status === 'done') return
  const index = rows.length
  rows.push({ node, depth, parent })
  for (const child of node.children) flatten(child, depth + 1, index, hideDone, rows)
}

function branchColor(node: TreeNode): string {
  if (node.status === 'done') return COLOR.done
  return node.branch ? COLOR[node.branch] : COLOR.muted
}

function marker(node: TreeNode, x: number, y: number): string {
  const fill = branchColor(node)
  // Папка — ромб, узел — круг; невыполненный «по желанию» рисуем контуром, как ○ на странице
  if (node.folder) return `<path d="M ${x} ${y - 5} L ${x + 5} ${y} L ${x} ${y + 5} L ${x - 5} ${y} Z" fill="${fill}" />`
  if (node.status === 'muted') return `<circle cx="${x}" cy="${y}" r="4" fill="${COLOR.background}" stroke="${fill}" stroke-width="1.5" />`
  return `<circle cx="${x}" cy="${y}" r="4" fill="${fill}" />`
}

export function treeToSvg(root: TreeNode, options?: { hideDone?: boolean }): string {
  const rows: Row[] = []
  flatten(root, 0, -1, !!options?.hideDone, rows)

  const height = rows.length * ROW_HEIGHT + PADDING * 2
  const xOf = (depth: number) => PADDING + depth * INDENT
  const yOf = (index: number) => PADDING + index * ROW_HEIGHT + ROW_HEIGHT / 2

  const lines: string[] = []
  const markers: string[] = []
  const texts: string[] = []

  rows.forEach((row, index) => {
    const x = xOf(row.depth)
    const y = yOf(index)
    if (row.parent >= 0) {
      const parentX = xOf(rows[row.parent].depth)
      const parentY = yOf(row.parent)
      lines.push(`<path d="M ${parentX} ${parentY} V ${y} H ${x - 6}" fill="none" stroke="${COLOR.line}" stroke-width="1" />`)
    }
    markers.push(marker(row.node, x, y))

    const isFolder = !!row.node.folder
    const fill = row.node.status === 'done' || row.node.status === 'muted' ? COLOR.muted : COLOR.text
    const weight = isFolder ? ' font-weight="600"' : ''
    const meta = row.node.meta ? `<tspan dx="8" font-size="11" fill="${COLOR.muted}">· ${escapeXml(clip(row.node.meta))}</tspan>` : ''
    texts.push(`<text x="${x + 12}" y="${y + 4}" font-size="13" fill="${fill}"${weight}>${escapeXml(clip(row.node.label))}${meta}</text>`)
  })

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${height}" width="${WIDTH}" height="${height}" font-family="-apple-system, Segoe UI, Roboto, sans-serif">`,
    `<title>${escapeXml(clip(root.label))} — дерево плана</title>`,
    `<rect x="0" y="0" width="${WIDTH}" height="${height}" fill="${COLOR.background}" />`,
    ...lines,
    ...markers,
    ...texts,
    '</svg>',
  ].join('\n')
}
