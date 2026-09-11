
import katex from 'katex'
import fs from 'fs'
const unit = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'))
const SPLIT = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g
const BS = String.fromCharCode(92)
function check(name, text) {
  console.log('=== ' + name + ' ===')
  console.log('total dollar chars:', (text.match(/\$/g) || []).length)
  const parts = text.split(SPLIT)
  for (const part of parts) {
    if (part === '') continue
    const isD = part.length > 4 && part.startsWith('$$') && part.endsWith('$$')
    const isI = !isD && part.length > 2 && part.startsWith('$') && part.endsWith('$')
    if (isD || isI) {
      const tex = isD ? part.slice(2, -2) : part.slice(1, -1)
      try {
        katex.renderToString(tex, { displayMode: isD, throwOnError: true, strict: 'warn' })
        console.log((isD ? '[display OK] ' : '[inline  OK] ') + tex.slice(0, 100))
      } catch (e) {
        console.log((isD ? '[display FAIL] ' : '[inline  FAIL] ') + tex.slice(0, 140) + ' -> ' + e.message)
      }
    } else {
      if (part.includes('$')) console.log('[!! stray dollar in plain text] ' + JSON.stringify(part))
      if (part.includes(BS)) console.log('[!! backslash in plain text] ' + JSON.stringify(part.slice(0, 140)))
      console.log('[text] |' + part + '|')
    }
  }
}
check('prompt', unit.prompt)
check('answer', unit.answer)
