# Content Hub Service
This service is a REST API which crawls submitted URLs and stores the
extracted content.

## Configuration
This service is configured using environment variables.  The default values
are put in the .env file.
* URL_EXTRACT_URL: URL to the (url-extract)[https://github.com/jpictor/url-extract]
service.

## Development
```bash
$ nvm use
$ npm install
$ npm run compile
```

Now to run the compiled server (production):
```bash
$ npm start
```

You can run it using babel-node for development:
```bash
$ npm run dev
```
