const fs = require('fs')
const path = require('path')

function addPage(page) {
  const route = page === 'index' ? '' : `/${page}`

  return `  <url>
    <loc>${`${process.env.WEBSITE_URL}${route}`}</loc>
    <changefreq>hourly</changefreq>
  </url>`
}

function getPages(dir) {
  return fs.readdirSync(dir)
    .filter(file => file.endsWith('.tsx') && !file.startsWith('_'))
    .map(file => file.replace('.tsx', ''))
}

function generateSitemap() {
  const pages = getPages(path.join(__dirname, '..', 'pages'))
  const sitemap = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(addPage).join('\n')}
</urlset>`

  fs.writeFileSync(path.join(__dirname, '..', 'public', 'sitemap.xml'), sitemap)
}

generateSitemap()