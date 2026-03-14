const fs = require('fs')
const path = require('path')

function addPage(page) {
  const route = page === '' ? '' : `/${page}`

  return `  <url>
    <loc>${`${process.env.WEBSITE_URL}${route}`}</loc>
    <changefreq>hourly</changefreq>
  </url>`
}

function getPages(dir, prefix = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const pages = []

  for (const entry of entries) {
    if (entry.isDirectory()) {
      pages.push(...getPages(path.join(dir, entry.name), `${prefix}${entry.name}/`))
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.mdx')) && !entry.name.startsWith('_')) {
      const name = entry.name.replace(/\.(tsx|mdx)$/, '')
      const route = name === 'index' ? prefix.replace(/\/$/, '') : `${prefix}${name}`
      pages.push(route)
    }
  }

  return pages
}

function generateSitemap() {
  const pages = getPages(path.join(__dirname, '..', 'pages'))
  const sitemap = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(addPage).join('\n')}
</urlset>`

  fs.writeFileSync(path.join(__dirname, '..', 'public', 'sitemap.xml'), sitemap)
}

generateSitemap()