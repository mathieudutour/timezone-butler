import Link from 'next/link'
import Layout from '../components/layout'

export default function Privacy() {
  return (
    <Layout>
      <header className="container text-center">
        <Link href="/">
          <a>
            <img
              alt="Timezone Butler"
              height="128"
              width="128"
              src="https://user-images.githubusercontent.com/3254314/48670345-471db980-eb0e-11e8-9645-14684a063079.png"
            />
          </a>
        </Link>
      </header>
      <div className="container hero">
        <h1 className="text-center">At your service!</h1>

        <p>
          I will now help your team dealing with timezone differences. Don't
          forget to <strong>invite me to the channels</strong> you would like me
          to take care of.
        </p>

        <p>
          If you appreciate my help and would like to show support, you can{' '}
          <a href="https://twitter.com/mathieudutour" target="_blank">
            follow me on Twitter
          </a>{' '}
          or{' '}
          <a
            href="https://github.com/mathieudutour/timezone-butler"
            target="_blank"
          >
            star my source code
          </a>
          .
        </p>
        <p>- Your new timezone butler</p>
        <a
          className="cta"
          href={`https://slack.com/app_redirect?app=${process.env.SLACK_APP_ID}`}
        >
          Go back to Slack
        </a>
      </div>
    </Layout>
  )
}
