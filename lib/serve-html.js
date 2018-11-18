const path = require('path')
const fs = require('fs')

const assets = {
  header: fs.readFileSync(
    path.join(__dirname, '../views/_header.html'),
    'utf-8'
  ),
  footer: fs.readFileSync(
    path.join(__dirname, '../views/_footer.html'),
    'utf-8'
  ),
  loggedIn: fs.readFileSync(
    path.join(__dirname, '../views/logged-in.html'),
    'utf-8'
  ),
  index: fs.readFileSync(path.join(__dirname, '../views/index.html'), 'utf-8'),
  privacy: fs.readFileSync(
    path.join(__dirname, '../views/privacy.html'),
    'utf-8'
  ),
  404: fs.readFileSync(path.join(__dirname, '../views/404.html'), 'utf-8'),
}

module.exports = function serveHTML(res, html, vars) {
  res.setHeader('Content-Type', 'text/html')
  res.end(
    assets.header +
      Object.keys(vars || {}).reduce(
        (prev, k) => prev.replace(new RegExp(`{{{${k}}}}`, 'g'), vars[k]),
        assets[html] || html
      ) +
      assets.footer
  )
}
