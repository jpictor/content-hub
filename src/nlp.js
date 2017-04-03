import { get } from 'lodash'
import rp from 'request-promise'
import winston from 'winston'

export async function nlpTagger (text) {
  const [ spotlightDoc, stanfordDoc ] = await Promise.all([
    spotlightTagger(text),
    stanfordTagger(text)
  ])
  return {
    spotlight: spotlightDoc,
    stanford: stanfordDoc
  }
}

export async function spotlightTagger (text) {
  const options = {
    method: 'POST',
    url: `${process.env.SPOTLIGHT_URL}/api/spotlight/rest/annotate`,
    form: {
      confidence: '0.70',
      text: text
    },
    headers: {
      accept: 'application/json'
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
      winston.error(`ERROR SPOTLIGHT-TAGGER: statusCode=${resp.statusCode}`)
      return {}
    }
    return resp.body
  } catch (err) {
    winston.error(`ERROR SPOTLIGHT-TAGGER: err=${err.message}`)
    return {}
  }
}

export async function stanfordTagger (text) {
  const stanfordNlpProperties = {
    annotators: 'tokenize,ssplit,pos,lemma,ner,depparse,openie,coref',
    outputFormat: 'json'
  }
  const options = {
    method: 'POST',
    url: `${process.env.STANFORD_NLP_URL}/api/stanford-nlp/`,
    qs: {
      properties: JSON.stringify(stanfordNlpProperties)
    },
    body: text,
    headers: {
      accept: 'application/json'
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
      winston.error(`ERROR STANFORD-TAGGER: statusCode=${resp.statusCode}`)
      return {}
    }
    return resp.body
  } catch (err) {
    winston.error(`ERROR STANFORD-TAGGER: err=${err.message}`)
    return {}
  }
}
