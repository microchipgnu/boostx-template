/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
// import { neynar } from 'frog/hubs'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'

const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
})

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.hono.get("/attestation", (c) => {
  return c.text("Hello, World!")
})

app.frame("/", (c) => {
  return c.res({
    image: "https://i.imgur.com/aty9p8X.gif",
    intents: [
      <Button action="/actions">Start</Button>
    ],
    imageAspectRatio: "1.91:1"
  })
})

app.frame('/actions', (c) => {
  return c.res({
    image: (
      <div tw="flex flex-col items-center justify-center h-full">
        <div tw="text-white text-3xl">Test Actions</div>
      </div>
    ),
    intents: [
      <Button.AddCastAction
        action="/boost-this"
        name="Boost Post"
        icon="broadcast"
      >
        Add Boost
      </Button.AddCastAction>,
      <Button.AddCastAction
        action="/is-boosted"
        name="Is Boosted"
        icon="eye"
      >
        Is Boosted
      </Button.AddCastAction>,
    ],
  })
})

app.castAction('/boost-this', async (c) => {
  console.log(
    `Cast Action to ${JSON.stringify(c.actionData.castId)} from ${c.actionData.fid
    }`,
  )

  const castHash = c.actionData.castId.hash
  console.log(c)


  try {
    // await registerPost(castHash, 1000000000000000000n, 100000000000000000n, c)
    return c.res({ message: 'Post $BOOSTed' })
  }
  catch (e: any) {
    console.log(e)
    return c.res({ message: e.toString() })
  }
})

app.castAction('/is-boosted', async (c) => {
  console.log(
    `Cast Action to ${JSON.stringify(c.actionData.castId)} from ${c.actionData.fid
    }`,
  )

  const castHash = c.actionData.castId.hash

  try {
    // const isBoosted = await checkPostBoosted(castHash) as boolean
    return c.res({ message: false ? 'Post $BOOSTed' : 'Post not $BOOSTed' })
  }
  catch (e: any) {
    console.log(e)
    return c.res({ message: e.toString() })
  }
})

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)