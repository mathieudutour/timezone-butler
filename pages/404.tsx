import Link from 'next/link'
import Layout from '../components/layout'

export default function NotFound() {
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
        <h1 className="text-center">
          I'm sorry, you seem lost. Can I help you?
        </h1>
        <h2>Perhaps you are looking for one of those pages?</h2>
        <ul>
          <li>
            <Link href="/">
              <a>Homepage</a>
            </Link>
          </li>
          <li>
            <Link href="/privacy">
              <a href="/privacy">Privacy Statement</a>
            </Link>
          </li>
          <li>
            <a href="https://github.com/mathieudutour/timezone-butler">
              Source code
            </a>
          </li>
        </ul>
        <h2>Or you would like to talk to my creator?</h2>
        <ul>
          <li>
            <a href="https://github.com/mathieudutour">Github</a>
          </li>
          <li>
            <a href="https://twitter.com/mathieudutour">Twitter</a>
          </li>
          <li>
            <a href="https://mathieu.dutour.me">Website</a>
          </li>
        </ul>
      </div>
    </Layout>
  )
}
