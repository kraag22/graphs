// JSON is inserted into inline scripts by the Pug templates. Prevent spreadsheet
// values from closing the script element or introducing literal line separators.
module.exports = function serialize(value) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}
