import { useMemo } from 'react'
import { ALL_SESSIONS } from '../data/plan'

/* Видео к конспекту берутся из того же места, что и ссылки на занятиях плана
   (src/data/plan.ts): у занятия есть темы программы и проверенные ссылки на разборы.
   Отдельный список для конспектов не заводим — иначе он разъедется с планом. */

interface Video {
  label: string
  url: string
  topic: number
}

function videosFor(topics: number[]): Video[] {
  const seen = new Set<string>()
  const out: Video[] = []
  for (const topic of topics) {
    for (const session of ALL_SESSIONS) {
      if (!session.links || !session.topics?.includes(topic)) continue
      for (const link of session.links) {
        if (seen.has(link.url)) continue
        seen.add(link.url)
        out.push({ ...link, topic })
      }
    }
  }
  return out
}

export function NoteVideos({ topics }: { topics: number[] }) {
  const videos = useMemo(() => videosFor(topics), [topics])
  if (videos.length === 0) return null

  return (
    <section className="note-videos" aria-labelledby={`note-videos-${topics[0]}`}>
      <h3 className="note__heading" id={`note-videos-${topics[0]}`}>
        Видео по этим темам
      </h3>
      <p className="note__paragraph">
        Разборы с русскоязычных каналов — те же ссылки стоят у соответствующих занятий плана. Открываются в новой вкладке.
      </p>
      <ul className="note-videos__list">
        {videos.map((video) => (
          <li className="note-videos__item" key={video.url}>
            <span className="note-videos__topic">Тема {video.topic}</span>
            <a className="note-videos__link" href={video.url} target="_blank" rel="noopener noreferrer">
              {video.label.replace(/^YouTube\s*·\s*/, '')}
              <span aria-hidden="true"> ↗</span>
              <span className="visually-hidden"> (откроется в новой вкладке)</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
