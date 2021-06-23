"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.logExit = exports.logSuccess = exports.logEvent = exports.diffBetweenCurrentTime = exports.formatDate = exports.currencyFilter = exports.pluralize = void 0;
var date_fns_1 = require("date-fns");
var api_1 = require("../services/api");
/**
 * @desc small helper for pluralizing words for display given a number of items
 */
function pluralize(noun, count) {
    return count === 1 ? noun : noun + "s";
}
exports.pluralize = pluralize;
/**
 * @desc converts number values into $ currency strings
 */
function currencyFilter(value) {
    if (typeof value !== 'number') {
        return '-';
    }
    var isNegative = value < 0;
    var displayValue = value < 0 ? -value : value;
    return (isNegative ? '-' : '') + "$" + displayValue
        .toFixed(2)
        .replace(/(\d)(?=(\d{3})+(\.|$))/g, '$1,');
}
exports.currencyFilter = currencyFilter;
var months = [
    null,
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];
/**
 * @desc Returns formatted date.
 */
function formatDate(timestamp) {
    if (timestamp) {
        // slice will return the first 10 char(date)of timestamp
        // coming in as: 2019-05-07T15:41:30.520Z
        var _a = timestamp.slice(0, 10).split('-'), y = _a[0], m = _a[1], d = _a[2];
        return months[+m] + " " + d + ", " + y;
    }
    return '';
}
exports.formatDate = formatDate;
/**
 * @desc Checks the difference between the current time and a provided time
 */
function diffBetweenCurrentTime(timestamp) {
    return date_fns_1.distanceInWords(new Date(), date_fns_1.parse(timestamp), {
        addSuffix: true,
        includeSeconds: true
    }).replace(/^(about|less than)\s/i, '');
}
exports.diffBetweenCurrentTime = diffBetweenCurrentTime;
exports.logEvent = function (eventName, metadata, error) {
    console.log("Link Event: " + eventName, metadata, error);
};
exports.logSuccess = function (_a, userId) {
    var institution = _a.institution, accounts = _a.accounts, link_session_id = _a.link_session_id;
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    exports.logEvent('onSuccess', {
                        institution: institution,
                        accounts: accounts,
                        link_session_id: link_session_id
                    });
                    return [4 /*yield*/, api_1.postLinkEvent({
                            userId: userId,
                            link_session_id: link_session_id,
                            type: 'success'
                        })];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
};
exports.logExit = function (error, _a, userId) {
    var institution = _a.institution, status = _a.status, link_session_id = _a.link_session_id, request_id = _a.request_id;
    return __awaiter(void 0, void 0, void 0, function () {
        var eventError;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    exports.logEvent('onExit', {
                        institution: institution,
                        status: status,
                        link_session_id: link_session_id,
                        request_id: request_id
                    }, error);
                    eventError = error || {};
                    return [4 /*yield*/, api_1.postLinkEvent(__assign(__assign({ userId: userId,
                            link_session_id: link_session_id,
                            request_id: request_id, type: 'exit' }, eventError), { status: status }))];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
};
