"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = formatDate;

var _moment = _interopRequireDefault(require("moment"));

var _index = require("./index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function formatLocalDate() {
  var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var outputType = arguments.length > 1 ? arguments[1] : undefined;

  if (outputType == 'utc') {
    return (0, _index.formatLocalDateAsUTC)(args, outputType);
  }

  return (0, _index.formatLocalDateAsLocal)(args, outputType);
}

function formatUTCDate() {
  var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var outputType = arguments.length > 1 ? arguments[1] : undefined;

  if (outputType == 'utc') {
    return (0, _index.formatUTCDateAsUTC)(args, outputType);
  }

  return (0, _index.formatUTCDateAsLocal)(args, outputType);
}

function formatDate() {
  var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var outputType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'utc';
  var inputType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'local';

  var _args = _slicedToArray(args, 6),
      year = _args[0],
      month = _args[1],
      date = _args[2],
      hours = _args[3],
      minutes = _args[4],
      seconds = _args[5];

  if (args.length === 3) {
    return (0, _moment["default"])([year, month - 1, date]).format('YYYYMMDD');
  }

  if (inputType === 'local') {
    return formatLocalDate([year, month, date, hours, minutes, seconds || 0], outputType);
  } // type === 'utc'


  return formatUTCDate([year, month, date, hours, minutes, seconds || 0], outputType);
}