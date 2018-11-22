const path = require('path')
const fs = require('fs')

const COMMON_ENV_VARS = {
  SLACK_APP_ID: process.env.SLACK_APP_ID,
}

const replaceVars = (text, vars) =>
  Object.keys(vars || {}).reduce(
    (prev, k) => prev.replace(new RegExp(`{{{${k}}}}`, 'g'), vars[k]),
    text
  )

const assets = {
  header: replaceVars(
    fs.readFileSync(path.join(__dirname, '../views/_header.html'), 'utf-8'),
    COMMON_ENV_VARS
  ),
  footer: replaceVars(
    fs.readFileSync(path.join(__dirname, '../views/_footer.html'), 'utf-8'),
    COMMON_ENV_VARS
  ),
  loggedIn: replaceVars(
    fs.readFileSync(path.join(__dirname, '../views/logged-in.html'), 'utf-8'),
    COMMON_ENV_VARS
  ),
  index: replaceVars(
    fs.readFileSync(path.join(__dirname, '../views/index.html'), 'utf-8'),
    COMMON_ENV_VARS
  ),
  privacy: replaceVars(
    fs.readFileSync(path.join(__dirname, '../views/privacy.html'), 'utf-8'),
    COMMON_ENV_VARS
  ),
  404: replaceVars(
    fs.readFileSync(path.join(__dirname, '../views/404.html'), 'utf-8'),
    COMMON_ENV_VARS
  ),
}

module.exports = function serveHTML(res, html, vars) {
  res.setHeader('Content-Type', 'text/html')
  res.end(
    Object.keys(vars || {}).reduce(
      (prev, k) => prev.replace(new RegExp(`{{{${k}}}}`, 'g'), vars[k]),
      assets.header + (assets[html] || html) + assets.footer
    )
  )
}
