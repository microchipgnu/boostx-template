import { getFrameMetadata } from 'frog/next'
import type { Metadata } from 'next'


export async function generateMetadata(): Promise<Metadata> {
  const frameTags = await getFrameMetadata(
    `${"https://boostx-system.vercel.app" || 'http://localhost:3000'}/api`,
  )
  return {
    other: frameTags,
  }
}

export default function Home() {
  return (
    <div>
      `npm install boostx`

      <a href='/api/dev'>dev</a>

      {JSON.stringify(process.env)}
    </div>
  )
}
