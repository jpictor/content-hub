import http from 'http'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import winston from 'winston'
import expressWinston from 'express-winston'
import epilogue from 'epilogue'
import { crawl } from './crawl'
import { nlpTagger } from './nlp'
import db from './models'

async function crawlApi (req, res) {
  await crawl(req.body)
  res.json({message: 'ok'})
}

async function nlpApi (req, res) {
  const response = await nlpTagger(req.body)
  res.json(response)
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

const router = express.Router()

router.route('/crawl')
  .post(errorChecking(crawlApi))
  .all(errorChecking(notAllowed))

router.route('/nlp')
  .post(errorChecking(nlpApi))
  .all(errorChecking(notAllowed))

const app = express()
app.db = db
app.use(cors())

app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console({
      colorize: true
    })
  ]
}))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use('/api/content-hub', router)

epilogue.initialize({
  app: app,
  sequelize: db.database
})
epilogue.resource({
  model: db.Content,
  actions: ['read', 'list'], // ['create', 'read', 'update', 'delete', 'list']
  pagination: true,
  endpoints: ['/api/content-hub/content', '/api/content-hub/content/:id'],
  sort: {
    default: '-created_at'
  },
  count: 3,
  excludeAttributes: ['html']
})

const server = http.createServer(app)

winston.info(`Content-Hub Service started on port ${process.env.PORT}`)
server.listen(process.env.PORT).on('error', err => {
  winston.error(`ERROR: ${err.message}`)
})
