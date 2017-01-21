const rp = require('request-promise');
const rp_errors  = require('request-promise/errors');


export async function crawl(crawlDoc) {
    let options = {
        method: 'GET',
        url: 'http://localhost:8192/api/url-extract/html_extract',
        qs: {
            url: crawlDoc.url
        },
        json: true,
        simple: false, 
        resolveWithFullResponse: true,
        timeout: 10000,
        strictSSL: false
    };
    console.log(`crawl: url=${crawlDoc.url}`)
    let resp = await rp(options);
    console.log(`crawl: url=${crawlDoc.url} title=${resp.body.title}`)
    
}
