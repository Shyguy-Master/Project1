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

  if (characters[body.name]) {
    responseJSON.message = 'Character already exists.';
    responseJSON.id = 'addCharProhibitedParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  characters[body.name] = {};
  characters[body.name].name = body.name;
  characters[body.name].tier = body.tier;
  if (!body.note) {
    characters[body.name].note = '';
  } else {
    characters[body.name].note = body.note;
  }

  responseJSON.message = 'Created Successfully';
  responseJSON.characters = characters;
  return respondJSON(request, response, 201, responseJSON);
};

// editChar
const editChar = (request, response, body) => {
  const responseJSON = {
    message: 'Name and tier are both required.',
  };

  if (!body.name || !body.tier) {
    responseJSON.id = 'editCharMissingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  const responseCode = 204;

  if (!characters[body.name]) {
    characters[body.name] = {};
    delete characters[body.oldName];
  } else if (body.name !== body.oldName) {
    responseJSON.message = 'Character already exists.';
    responseJSON.id = 'editCharProhibitedParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  characters[body.name].name = body.name;
  characters[body.name].tier = body.tier;
  if (!body.note) {
    characters[body.name].note = '';
  } else {
    characters[body.name].note = body.note;
  }

  return respondJSONMeta(request, response, responseCode);
};

// deleteChar
const deleteChar = (request, response, body) => {
  if (!characters[body.name]) {
    const responseJSON = {
      message: 'Character does not exist.',
      id: 'deleteCharProhibitedParams',
    };

    return respondJSON(request, response, 400, responseJSON);
  }

  delete characters[body.name];
  return respondJSONMeta(request, response, 204);
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
  editChar,
  deleteChar,
  notFound,
  getCharsMeta,
  notFoundMeta,
};
