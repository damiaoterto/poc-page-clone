const axios = require('axios')
const cheerio = require('cheerio')
const { URL } = require('node:url')
const { resolve, join, basename, extname } = require('node:path')
const fs = require('node:fs/promises')
const { createHash } = require('node:crypto')

const WEB_SITES_PAGE = resolve(process.cwd(), 'websites')

async function downloadWebpage(pageUrl) {
  const response = await axios.get(pageUrl)
  const $ = cheerio.load(response.data)
  const parsedUrl = new URL(pageUrl)
  const baseUrl = `${parsedUrl.protocol}//${parsedUrl.host}`

  const domain = parsedUrl.hostname
  const webpagePath = join(WEB_SITES_PAGE, domain)
  await fs.mkdir(webpagePath, { recursive: true })

  function genUniqueName(url) {
    const hash = createHash('md5').update(url).digest('hex')
    const originalExt = extname(url) || '.html'

    return `${hash}${originalExt}`
  }

  async function downloadResource(el, attr, type) {
    const resourceUrl = $(el).attr(attr)
      if (!resourceUrl) return

    try {
      const fullUrl = new URL(resourceUrl, baseUrl).href
      const response = await axios.get(fullUrl, { responseType: 'arraybuffer' })

      const uniqueFilename = genUniqueName(fullUrl)
      const localPath = join(type, uniqueFilename)

      await fs.mkdir(join(webpagePath, type), { recursive: true })
      await fs.writeFile(join(webpagePath, localPath), response.data)

      $(el).attr(attr, localPath.replace(/\\/g, '/'))

      console.log(`${type} subscribe resource: ${resourceUrl} -> ${localPath}`)
    } catch (error) {
      console.error(`Error ao baixar o recurso ${resourceUrl}`, error)
    }
  }

  await Promise.all(
    $('link[rel="stylesheet"]').map((i, el) => downloadResource(el, 'href', 'css')).get()
  )

  await Promise.all(
    $('script[src]').map((i, el) => downloadResource(el, 'src', 'js')).get()
  )

  await Promise.all(
    $('img[src]').map((i, el) => downloadResource(el, 'src', 'img')).get()
  )

  const updatedHtml = $.html()
  await fs.writeFile(join(webpagePath, 'index.html'), updatedHtml)
}

downloadWebpage('https://site.com.br')
