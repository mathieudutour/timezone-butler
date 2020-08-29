import Link from 'next/link'
import Layout from '../components/layout'

export default function Contact() {
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
        <h1 className="text-center">Hello sir, madam.</h1>
        <h2>Did you find something to report?</h2>
        <ul>
          <li>
            <a href="https://github.com/mathieudutour/timezone-butler/issues/new?assignees=&labels=bug%2C+missed+time&template=missed-time.md&title=">
              I missed a time?
            </a>
          </li>
          <li>
            <a href="https://github.com/mathieudutour/timezone-butler/issues/new?assignees=&labels=bug%2C+wrong+time&template=wrongly-recognised-time.md&title=">
              I wrongly recognized a time?
            </a>
          </li>
          <li>
            <a href="https://github.com/mathieudutour/timezone-butler/issues/new?assignees=&labels=bug&template=bug_report.md&title=">
              Another bug?
            </a>
          </li>
          <li>
            <a href="https://github.com/mathieudutour/timezone-butler/issues/new?assignees=&labels=enhancement&template=feature_request.md&title=">
              A new feature suggestion?
            </a>
          </li>
        </ul>
        <h2>Perhaps you are looking for one of those pages?</h2>
        <ul>
          <li>
            <a href="https://github.com/mathieudutour/timezone-butler/blob/master/.github/SUPPORT.md">
              Frequently Asked Questions
            </a>
          </li>
          <li>
            <a href="https://github.com/mathieudutour/timezone-butler/blob/master/docs">
              Documentation
            </a>
          </li>
          <li>
            <a href="/privacy">Privacy Statement</a>
          </li>
          <li>
            <a href="https://github.com/mathieudutour/timezone-butler">
              Source code
            </a>
          </li>
        </ul>
        <h2>Or you would like to talk directly to my creator?</h2>
        <ul>
          <li>
            <a href="https://twitter.com/messages/compose?recipient_id=362104578">
              Twitter Direct Message
            </a>
          </li>
          <li>
            <a href="https://mathieu.dutour.me">Website</a>
          </li>
        </ul>
      </div>
    </Layout>
  )
}
