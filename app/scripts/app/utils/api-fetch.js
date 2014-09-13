function apiFetch (path) {
  return $.getJSON('/api/v1/' + path).then(function (payload) {
    parseFields(payload);
    return payload;
  });
};

function parseFields (payload) {
  if (Array.isArray(payload)) {
    payload.forEach(parseFields);
    return;
  }

  if (typeof payload === 'object' && payload.hasOwnProperty('fields')) {
    payload.fields = JSON.parse(payload.fields);
  }
}

export default apiFetch;
export { apiFetch, parseFields };
