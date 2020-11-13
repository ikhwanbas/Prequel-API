// === This is a collection of helper functions to help us in manipulating the date :) ===

const dayjs = require('dayjs')
/**
 * Usage:
 * 
 *      validateDateFormat('2020-12-30', 'YYYY-MM-DD')
 *      >> true
 * 
 * validateDateFormat --> a function to validate date format
 * @param {String|Array} date date to be checked
 * @param {String} format the date format
 * @returns {boolean} return true if the format is right or false if wrong
 */
function validateDateFormat(date, format) {
    return dayjs(date).format(format) === date;
}

module.exports = {
    validateDateFormat
}