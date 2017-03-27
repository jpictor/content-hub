const express = require('express')
const bodyParser = require('body-parser')
const rp = require('request-promise')
const rp_errors = require('request-promise/errors')
const qs = require('querystring')
const args = require('minimist')(process.argv.slice(2))
const yaml = require('js-yaml')
const fs = require('fs')
import * as crawl from './crawl'

// Get document, or throw exception on error
const configPath = args.config || 'server.yml'
try {
  console.log('loaded configuration file: ' + configPath)
  var configDoc = yaml.safeLoad(fs.readFileSync(configPath, 'utf8'))
} catch (e) {
  console.log(e)
  throw new Error('configuration file not found')
}

async function crawlApi (req, res) {
  console.log(`POST: /api/content-hub/crawl url=${req.body.url}`)
  crawl.crawl(req.body, configDoc)
  res.json({message: 'ok'})
}

function errorChecking (routeHandler) {
  return async function (req, res, next) {
    try {
      await routeHandler(req, res, next)
    } catch (err) {
      res.status(500).json({error: 'internal server error'})
      next(err)
    }
  }
}

function notAllowed (req, res) {
  res.status(405).json({error: 'method not allowed'})
}

var router = express.Router()

router.route('/crawl')
    .post(errorChecking(crawlApi))
    .all(errorChecking(notAllowed))

var app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use('/api/content-hub', router)

var port = args.port || 2224
app.listen(port)
console.log(`Content-Core Service started on port ${port}`)
