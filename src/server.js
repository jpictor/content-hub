import http from 'http'
import express from 'express'
import bodyParser from 'body-parser'
import winston from 'winston'
import expressWinston from 'express-winston'
import epilogue from 'epilogue'
import { crawl } from './crawl'
import { nlpTagger } from './nlp'
import db from './models'

const tryText = `
First documented in the 13th century, Berlin was the capital of the Kingdom of Prussia (1701–1918), the German Empire (1871–1918), the Weimar Republic (1919–33) and the Third Rei
ch (1933–45). Berlin in the 1920s was the third largest municipality in the world. After World War II, the city became divided into East Berlin -- the capital of East Germany --
and West Berlin, a West German exclave surrounded by the Berlin Wall from 1961–89. Following German reunification in 1990, the city regained its status as the capital of Germany,
 hosting 147 foreign embassies.`

async function crawlApi (req, res) {
  crawl(req.body)
  res.json({message: 'ok'})
}

async function nlpApi (req, res) {
  const response = await nlpTagger(tryText)
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
  .get(errorChecking(nlpApi))
  .all(errorChecking(notAllowed))

const app = express()
app.db = db

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
