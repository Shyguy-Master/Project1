const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/getChars': jsonHandler.getChars,
    '/style.css': htmlHandler.getCSS,
    '/notReal': jsonHandler.notFound,
    notFound: jsonHandler.notFound,
  },
  HEAD: {
    '/getChars': jsonHandler.getCharsMeta,
    '/notReal': jsonHandler.notFoundMeta,
    notFound: jsonHandler.notFoundMeta,
  },
  POST: {
    '/addChar': jsonHandler.addChar,
    '/editChar': jsonHandler.editChar,
    '/deleteChar': jsonHandler.deleteChar,
  },
};

const parseBody = (request, response, handler) => {
  const body = [];

  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);

    return handler(request, response, bodyParams);
  });
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  if (!urlStruct[request.method]) {
    return urlStruct.HEAD.notFound(request, response);
  }

  if (request.method === 'POST') {
    // if (parsedUrl.pathname === '/addChar') {
    //   return parseBody(request, response, urlStruct[request.method][parsedUrl.pathname]);
    // } else if (parsedUrl.pathname === '/editChar') {
    //   return parseBody(request, response, urlStruct[request.method][parsedUrl.pathname]);
    // }
    return parseBody(request, response, urlStruct[request.method][parsedUrl.pathname]);
  } if (urlStruct[request.method][parsedUrl.pathname]) {
    return urlStruct[request.method][parsedUrl.pathname](request, response);
  }

  return urlStruct[request.method].notFound(request, response);
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1:${port}`);
});
