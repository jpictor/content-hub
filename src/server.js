import express from 'express'
import bodyParser from 'body-parser'
import { crawl } from './crawl'

async function crawlApi (req, res) {
  console.log(`POST: /api/content-hub/crawl url=${req.body.url}`)
  crawl(req.body)
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

var port = process.env.PORT || 2224
app.listen(port)
console.log(`Content-Hub Service started on port ${port}`)
