const characters = {};

// respondJSON
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

// respondJSONMeta
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

// getChars
const getChars = (request, response) => {
  const responseJSON = {
    characters,
  };

  return respondJSON(request, response, 200, responseJSON);
};

// getCharsMeta
const getCharsMeta = (request, response) => respondJSONMeta(request, response, 200);

// addChar
const addChar = (request, response, body) => {
  const responseJSON = {
    message: 'Name and tier are both required.',
  };

  if (!body.name || !body.tier) {
    responseJSON.id = 'addCharMissingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 204;

  if (!characters[body.name]) {
    responseCode = 201;
    characters[body.name] = {};
  }

  characters[body.name].name = body.name;
  characters[body.name].tier = body.tier;
  if (!body.note) {
    characters[body.name].note = '';
  } else {
    characters[body.name].note = body.note;
  }

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
};

// notFound
const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  return respondJSON(request, response, 404, responseJSON);
};

// notFoundMeta
const notFoundMeta = (request, response) => respondJSONMeta(request, response, 404);

module.exports = {
  getChars,
  addChar,
  notFound,
  getCharsMeta,
  notFoundMeta,
};
