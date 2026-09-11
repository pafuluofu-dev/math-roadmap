import katex from 'katex'
const text = String.raw`$\sin x/x\to1$; $(1+1/x)^x\to e$; при $x\to0$ $\sin x\sim x$, $\tan x\sim x$, $1-\cos x\sim x^2/2$, $e^x-1\sim x$, $\ln(1+x)\sim x$.`
const SPLIT = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g
const parts = text.split(SPLIT)
let ok = true
parts.forEach((p, i) => {
  const isDisplay = p.length > 4 && p.startsWith('$$') && p.endsWith('$$')
  const isInline = !isDisplay && p.length > 2 && p.startsWith('$') && p.endsWith('$')
  if (isDisplay || isInline) {
    const tex = isDisplay ? p.slice(2, -2) : p.slice(1, -1)
    try {
      katex.renderToString(tex, { displayMode: isDisplay, throwOnError: true, strict: 'warn' })
      console.log('OK  ', JSON.stringify(tex))
    } catch (e) {
      ok = false
      console.log('FAIL', JSON.stringify(tex), '->', e.message)
    }
  } else if (p !== '') {
    console.log('TXT ', JSON.stringify(p))
  }
})
console.log('display spans:', parts.filter(p=>p.startsWith('$$')).length)
console.log('ALL OK:', ok)
// leftover stray dollars in text parts?
const stray = parts.filter((p,i)=> !( (p.length>4&&p.startsWith('$$')&&p.endsWith('$$')) || (p.length>2&&p.startsWith('$')&&p.endsWith('$')) )).join('')
console.log('stray $ in plain text:', (stray.match(/\$/g)||[]).length)
