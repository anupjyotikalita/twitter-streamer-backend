const { HTTP_ERROR_CODES } = require("./constants");

const sendResponse = (res, statusCode, result, error) => {
  res.status(statusCode).send({
    data: result,
    error,
    statusCode,
  });
};

const isEmpty = arrayOrObject => size(arrayOrObject) === 0;
const size = arrayOrObject => (arrayOrObject) ? (isArray(arrayOrObject) ? arrayOrObject : Object.keys(arrayOrObject)).length : 0;
const isArray = variable => variable instanceof Array;

const holdOn = (delay) => new Promise((resolve) => {
    setTimeout(() => resolve(), delay);
  });

module.exports = {
    sendResponse,
    isEmpty,
    holdOn,
}
