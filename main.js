const axios = require('axios')
const cheerio = require('cheerio')
const { URL } = require('node:url')
const { resolve, join, basename } = require('node:path')
const fs = require('node:fs/promises')

const WEB_SITES_PAGE = resolve(process.cwd(), 'websites')

async function downloadWebpage(pageUrl) {
  const response = await axios.get(pageUrl)
  const $ = cheerio.load(response.data)
  const parsedUrl = new URL(pageUrl)
  const baseUrl = `${parsedUrl.protocol}//${parsedUrl.host}`

  const domain = parsedUrl.hostname
  const webpagePath = join(WEB_SITES_PAGE, domain)
  await fs.mkdir(webpagePath, { recursive: true })

  await fs.writeFile(join(webpagePath, 'index.html'), $.html())

  async function downloadResource(resourceUrl, type) {
    try {
      const fullUrl = new URL(resourceUrl, baseUrl).href
      const response = await axios.get(fullUrl, { responseType: 'arraybuffer' })
      const filename = basename(new URL(fullUrl).pathname)

      await fs.writeFile(join(webpagePath, type, filename), response.data)
    } catch (error) {
      console.error(`Error ao baixar o recurso ${resourceUrl}`, error)
    }
  }

  // Download CSS
  await fs.mkdir(join(webpagePath, 'css'), { recursive: true })
  $('link[rel="stylesheet"]').each((i, el) => {
    const href = $(el).attr('href')
    if (href) downloadResource(href, 'css')
  })

  // Download JS
  await fs.mkdir(join(webpagePath, 'js'), { recursive: true })
  $('script[src]').each((i, el) => {
    const src = $(el).attr('src')
    if (src) downloadResource(src, 'js')
  })

  // Download images
  await fs.mkdir(join(webpagePath, 'img'), { recursive: true })
  $('img[src]').each((i, el) => {
    const src = $(el).attr('src')
    if (src) downloadResource(src, 'img')
  })
}

downloadWebpage('https://assesi.com.br')
