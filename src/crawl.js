import { get } from 'lodash'
const rp = require('request-promise')
const rp_errors  = require('request-promise/errors')
const htmlToText = require('html-to-text')


export async function crawl(crawlDoc) {
    console.log(`START-CRAWL: url=${crawlDoc.url}`)
    const infoDoc = await urlInfo(crawlDoc.url)
    const resolvedUrl = get(infoDoc, 'url_info.resolved_url')
    const readability = get(infoDoc, 'html_extract.readability')
    const title = get(infoDoc, 'card.title')
    console.log(`CRAWL-COMPLETE: url=${crawlDoc.url} url=${resolvedUrl} title=${title}`)
    // console.log(`CRAWL-CARD: ${JSON.stringify(infoDoc.card)}`)
    console.log('')
}


export async function urlInfo(url) {
    const options = {
        method: 'GET',
        url: 'https://pictorlabs.com/api/url-extract/all',
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
