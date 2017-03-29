# Content Hub Service
A content ingestion service implementing a pipeline of scraping, tagging,
and storing text content.  The [url-extract](https://github.com/jpictor/url-extract)
is used to scrape HTML content given by URL.

## Configuration
This service is configured using environment variables.  The default values
are put in the .env file.
* PORT: Bind this service to port.
* URL_EXTRACT_URL: URL to the [url-extract](https://github.com/jpictor/url-extract)
service.
* DATABASE_URL: The URL to the Postgres database.

## Database
Postgres >= 9.5 is required.  Create the database by running:
```bash
$ createdb content_hub
$ npm run db:migrate
```

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
