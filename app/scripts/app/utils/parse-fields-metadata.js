function parseFields (payload) {
  if (Array.isArray(payload)) {
    payload.forEach(parseFields);
    return;
  }

  if (typeof payload === 'object' && payload.hasOwnProperty('fields')) {
    payload.fields = JSON.parse(payload.fields);
  }
}

export default parseFields;
