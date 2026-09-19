// Статический план для ИИ-ассистентов и краулеров: сайт — SPA, сервер отдаёт пустой index.html,
// и без этого файла содержимое снаружи не прочитать. Собирает public/plan.md из src/data/*;
// запускается перед vite build (npm run plan), сам файл в git не хранится — он всегда свежий на деплое.
import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SITE = 'https://pafuluofu-dev.github.io/math-roadmap/'

// Vite сам читает TypeScript и ?raw-импорты конспектов — отдельный компилятор не нужен
const vite = await createServer({ root, server: { middlewareMode: true, watch: null }, appType: 'custom', logLevel: 'error' })
let plan, checks, theory, resources, notes, bank
try {
  plan = await vite.ssrLoadModule('/src/data/plan.ts')
  checks = await vite.ssrLoadModule('/src/data/checks.ts')
  theory = await vite.ssrLoadModule('/src/data/theory.ts')
  resources = await vite.ssrLoadModule('/src/data/resources.ts')
  notes = await vite.ssrLoadModule('/src/data/notes.ts')
  bank = await vite.ssrLoadModule('/src/data/testBank.ts')
} finally {
  await vite.close()
}
const { WEEKS, BLOCKS, RETURN_DATE, CORE_END, PASS_THRESHOLD, PLANNED_HOURS } = plan

const cell = (value) => String(value ?? '').replace(/\|/g, '\\|').replace(/\s*\n\s*/g, ' ')
const table = (head, rows) =>
  [`| ${head.join(' | ')} |`, `|${head.map(() => '---').join('|')}|`, ...rows.map((row) => `| ${row.map(cell).join(' | ')} |`)].join('\n')
const links = (list) => (list && list.length ? list.map((item) => `[${item.label}](${item.url})`).join('; ') : '—')
const absolute = (url) => (/^https?:/.test(url) ? url : SITE + url.replace(/^\//, ''))
const KIND = { study: 'занятие', check: 'проверка', exam: 'пробный экзамен', diagnostic: 'диагностика', rest: 'отдых' }

const lines = []
lines.push('# Маршрут: математика — план повторения тем 1–24', '')
lines.push(
  `> Статический слепок плана с сайта ${SITE} — сайт одностраничный, и без этого файла его содержимое снаружи не прочитать. Собирается при каждой сборке из src/data. Галочки, результаты проверок и журнал ошибок хранятся только в браузере владельца и здесь не отражены.`,
  '',
)
lines.push(`- Сгенерировано: ${new Date().toISOString().slice(0, 10)}`)
lines.push(`- Основной план: недели 1–12, ${WEEKS[0].from} → ${CORE_END}; резерв и второй круг: недели 13–23`)
lines.push(`- Возвращение из академотпуска: ${RETURN_DATE}`)
lines.push(`- Порог любой проверки: ${PASS_THRESHOLD} %; плановый объём: ≈${PLANNED_HOURS} ч`)
lines.push(`- Рабочая программа: [${resources.PROGRAM_DOC.title}](${absolute(resources.PROGRAM_DOC.url)}) — ${resources.PROGRAM_DOC.note}`)
lines.push('')

lines.push('## Блоки', '', table(['Блок', 'Название', 'Недели', '≈ часов'], BLOCKS.map((block) => [block.id, block.title, `${block.weeks[0]}–${block.weeks[block.weeks.length - 1]}`, block.hours])), '')

lines.push('## Недели и занятия', '')
for (const week of WEEKS) {
  lines.push(`### Неделя ${week.n} · ${week.from} — ${week.to} · ${week.focus} · блок ${week.block}`, '')
  if (week.note) lines.push(week.note, '')
  if (week.sessions.length === 0) {
    lines.push('Занятий по плану нет — неделя для второго круга, занятия добавляет владелец на сайте.', '')
    continue
  }
  lines.push(
    table(
      ['Дата', 'Тип', 'Занятие', 'Мин', 'Темы', 'Вопросы программы', 'Пояснение', 'Материалы'],
      week.sessions.map((session) => [
        session.date,
        KIND[session.kind] ?? session.kind,
        session.title,
        session.minutes,
        session.topics?.join(', ') ?? '—',
        session.questions?.join('; ') ?? '—',
        session.notes ?? '—',
        links(session.links),
      ]),
    ),
    '',
  )
}

lines.push(
  '## Проверки и пробные экзамены',
  '',
  table(
    ['Дата', 'Проверка', 'Что покрывает', 'Формат', 'Порог, %', 'Заданий в банке'],
    checks.CHECKS.map((check) => [check.date, check.title, check.scope, check.format, check.threshold, bank.testsFor(check.id).length]),
  ),
  '',
  `Правило оценивания: ${checks.SCORING_RULE}`,
  '',
)

lines.push('## Вопросы теории', '')
for (const group of theory.THEORY_GROUPS) {
  const questions = theory.THEORY_QUESTIONS.filter((question) => question.source === group.source)
  lines.push(`### ${group.title}${group.tentative ? ' (предположительно)' : ''}`, '')
  let current = ''
  for (const question of questions) {
    if (question.group !== current) {
      current = question.group
      lines.push(`**${current}**`, '')
    }
    lines.push(`- ${question.text}`)
  }
  lines.push('')
}

lines.push('## Конспекты', '', `Полные тексты — на сайте, раздел «Конспекты» (${SITE}#/notes).`, '')
for (const note of notes.NOTES) {
  const words = note.body.split(/\s+/).length
  lines.push(`- ${note.title} — темы ${note.topics.join(', ')}, ≈${Math.round(words / 100) * 100} слов`)
}
lines.push('')

lines.push('## Материалы', '')
for (const resource of resources.RESOURCES) lines.push(`- ${resource.url ? `[${resource.title}](${resource.url})` : resource.title} — ${resource.note}`)
lines.push('')

writeFileSync(resolve(root, 'public/plan.md'), lines.join('\n') + '\n')
console.log(`plan.md: ${WEEKS.length} недель, ${WEEKS.reduce((sum, week) => sum + week.sessions.length, 0)} занятий, ${checks.CHECKS.length} проверок`)
