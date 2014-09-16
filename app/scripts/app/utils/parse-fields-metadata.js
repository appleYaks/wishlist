var fields = ['fields', 'date'];

function parseFields (payload) {
  var i;

  if (Array.isArray(payload)) {
    payload.forEach(parseFields);
    return;
  }

  if (typeof payload !== 'object') {
    return;
  }

  for (i = 0; i !== fields.length; ++i) {
    if (payload.hasOwnProperty(fields[i])) {
      if (fields[i] === 'date') {
        payload[fields[i]] = new Date(payload[fields[i]]);
      } else {
        payload[fields[i]] = JSON.parse(payload[fields[i]]);
      }
    }
  }
}

export default parseFields;
