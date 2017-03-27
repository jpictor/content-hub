import { get } from 'lodash'
import rp from 'request-promise'
import db from './models'

export async function crawl (crawlDoc) {
  console.log(`START-CRAWL: url=${crawlDoc.url}`)
  const infoDoc = await urlInfo(crawlDoc.url)
  const statusCode = get(infoDoc, 'html_extract.status_code')
  if (statusCode === 200) {
    const content = db.Content.build({
      url: crawlDoc.url,
      resolved_url: get(infoDoc, 'card.resolved_url'),
      title: get(infoDoc, 'card.title'),
      html: get(infoDoc, 'html_extract.readability'),
      text: get(infoDoc, 'html_extract.text'),
      metadata: get(infoDoc, 'card')
    })
    await content.save()
    console.log(`CRAWL-COMPLETE: url=${content.url} url=${content.resolved_url} title=${content.title}`)
  }
}

export async function urlInfo (url) {
  const options = {
    method: 'GET',
    url: `${process.env.URL_EXTRACT_URL}/api/url-extract/all`,
    qs: {
      url: url
    },
    json: true,
    simple: false,
    resolveWithFullResponse: true,
    timeout: 60000,
    strictSSL: false
  }
  try {
    const resp = await rp(options)
    if (resp.statusCode >= 500) {
      console.error(`ERROR URL-INFO: url=${url} statusCode=${resp.statusCode}`)
      return {}
    }
      // console.log(`URL-INFO: url=${url} resolved-url=${resp.body.url_info.resolved_url}`)
    return resp.body
  } catch (err) {
    console.error(`ERROR URL-INFO: url=${url} err=${err.message}`)
    return {}
  }
}
