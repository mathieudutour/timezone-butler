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
        <p className="text-center">
          A Slack butler who will take care of the timezone differences in your
          team.
        </p>

        <h1>TL;DR; We are super nice.</h1>

        <h2>Privacy</h2>

        <h3>What information do we collect?</h3>

        <p>
          We only collect the{' '}
          <a
            href="https://github.com/mathieudutour/timezone-butler/blob/develop/utils/db.ts#L12-L17"
            target="_blank"
          >
            Slack team name and ID
          </a>{' '}
          when you add the Timezone Butler to your Slack team.
        </p>
        <p>We do NOT collect any individual's data.</p>

        <h3>Will your information be shared with anyone?</h3>

        <p>No.</p>

        <h3>Do we use cookies or other tracking technologies?</h3>

        <p>No.</p>

        <h3>How long do we keep your information?</h3>

        <p>
          Until you remove the Butler from your team (it will be automatically
          deleted when the Slack is uninstalled).
        </p>

        <h2>License</h2>

        <p>Copyright (c) 2018-present, Mathieu Dutour</p>
        <p>
          Permission to use, copy, modify, and/or distribute this software for
          any purpose with or without fee is hereby granted, provided that the
          above copyright notice and this permission notice appear in all
          copies.
        </p>
        <p>
          THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL
          WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED
          WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE
          AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL
          DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR
          PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
          TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
          PERFORMANCE OF THIS SOFTWARE.
        </p>

        <hr />

        <p>
          Contact Us. Please send any questions about these stuff to
          <a href="mailto:mathieu@dutour.me">mathieu@dutour.me</a>.
        </p>
      </div>
    </Layout>
  )
}
