import moment from "moment";
/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
export const formatDate = (date:Date | string): string => moment(date).format("MMMM Do YYYY, h:mm:ss a");
export const smallDate = (date:Date | string): string => moment(date).format("MM/DD/YY");