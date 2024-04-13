/** @jsxImportSource frog/jsx */

import { checkPostBoosted } from '@/core/watcher/check-post-boosted'
import { finalizeEpoch } from '@/core/watcher/finalize-epoch'
import { getEarnedAmount } from '@/core/watcher/get-earned'
import { registerPost } from '@/core/watcher/register-boost'
import { setClaimAttestation } from '@/core/watcher/set-claim-attestation'
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

app.hono.get("/epoch", async (c) => {
  await finalizeEpoch()
  return c.text("Done")
})

app.frame("/", (c) => {
  return c.res({
    image: (
      <div tw="flex flex-col items-center justify-center h-full">
        <div tw="text-white text-3xl">Start</div>
      </div>
    ),
    intents: [
      <Button action="/actions">Start</Button>
    ],
    imageAspectRatio: "1.91:1"
  })
})

app.frame("/claim", async (c) => {
  const amount = await getEarnedAmount(c.frameData?.address as `0x${string}`)
  return c.res({
    image: (
      <div tw="flex flex-col items-center justify-center h-full">
        <div tw="text-white text-3xl flex">You've earned: {amount.toString()} ${process.env.SYMBOL! || ""}</div>
      </div>
    ),
    intents: [
      <Button action={amount > 0 ? "/claim-finished" : "/actions"}>{amount > 0 ? "Claim" : "Back to Actions"}</Button>
    ],
    imageAspectRatio: "1.91:1"
  })
})

app.frame("/claim-finished", async (c) => {

  await setClaimAttestation(c.frameData?.address as `0x${string}`, true)
  return c.res({
    image: (
      <div tw="flex flex-col items-center justify-center h-full">
        <div tw="text-white text-3xl">Wait a few seconds for it show up in your account.</div>
      </div>
    ),
    intents: [
      <Button action="/">Back to Start</Button>
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
        name={`Boost This (${process.env.SYMBOL})`}
        icon="broadcast"
      >
        Add Boost
      </Button.AddCastAction>,
      <Button.AddCastAction
        action="/is-boosted"
        name={`Is Boosted (${process.env.SYMBOL})`}
        icon="eye"
      >
        Is Boosted
      </Button.AddCastAction>,
      <Button action='/claim'>Claim</Button>,
    ],
  })
})

app.castAction('/boost-this', async (c) => {
  console.log(
    `Cast Action to ${JSON.stringify(c.actionData.castId)} from ${c.actionData.fid
    }`,
  )

  try {
    await registerPost({
      data: {
        castFid: c.actionData.fid,
        castHash: c.actionData.castId.hash
      }
    })
    return c.res({ message: `Post boosted for ${process.env.SYMBOL}` })
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

  try {
    const isBoosted = await checkPostBoosted({
      data: {
        castHash: c.actionData.castId.hash
      }
    })
    return c.res({ message: isBoosted ? `Post boosted ${process.env.SYMBOL}` : `Post NOT boosted for ${process.env.SYMBOL}` })
  }
  catch (e: any) {
    console.log(e)
    return c.res({ message: e.toString() })
  }
})

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)