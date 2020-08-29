import Head from 'next/head'

export default function Header() {
  return (
    <Head>
      <title>Timezone Butler</title>
      <meta name="title" content="Timezone Butler" />
      <meta
        name="description"
        content="Meet your new Timezone Butler, a Slack bot who will take care of the time zone differences in your team."
      />

      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://timezone-butler.now.sh/" />
      <meta property="og:title" content="Timezone Butler" />
      <meta
        property="og:description"
        content="Meet your new Timezone Butler, a Slack bot who will take care of the time zone differences in your team."
      />
      <meta
        property="og:image"
        content="https://user-images.githubusercontent.com/3254314/48671139-a33b0a80-eb1b-11e8-82af-1464a49c1631.png"
      />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://timezone-butler.now.sh/" />
      <meta property="twitter:title" content="Timezone Butler" />
      <meta
        property="twitter:description"
        content="Meet your new Timezone Butler, a Slack bot who will take care of the time zone differences in your team."
      />
      <meta
        property="twitter:image"
        content="https://user-images.githubusercontent.com/3254314/48671139-a33b0a80-eb1b-11e8-82af-1464a49c1631.png"
      />

      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="slack-app-id" content={process.env.SLACK_APP_ID} />
    </Head>
  )
}
