"use strict";
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
var react_1 = require("react");
var Button_1 = require("plaid-threads/Button");
var Touchable_1 = require("plaid-threads/Touchable");
var react_plaid_link_1 = require("react-plaid-link");
var react_router_dom_1 = require("react-router-dom");
var util_1 = require("../util"); // functions to log and save errors and metadata from Link events.
var api_1 = require("../services/api");
var services_1 = require("../services");
// Uses the usePlaidLink hook to manage the Plaid Link creation.  See https://github.com/plaid/react-plaid-link for full usage instructions.
// The link token passed to usePlaidLink cannot be null.  It must be generated outside of this component.  In this sample app, the link token
// is generated in the link context in client/src/services/link.js.
function LinkButton(props) {
    var _this = this;
    var history = react_router_dom_1.useHistory();
    var _a = services_1.useItems(), getItemsByUser = _a.getItemsByUser, getItemById = _a.getItemById;
    var generateLinkToken = services_1.useLink().generateLinkToken;
    // define onSuccess, onExit and onEvent functions as configs for Plaid Link creation
    var onSuccess = function (publicToken, metadata) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // log and save metatdata
                    util_1.logSuccess(metadata, props.userId);
                    if (!(props.itemId != null)) return [3 /*break*/, 2];
                    // update mode: no need to exchange public token
                    return [4 /*yield*/, api_1.setItemState(props.itemId, 'good')];
                case 1:
                    // update mode: no need to exchange public token
                    _a.sent();
                    getItemById(props.itemId, true);
                    return [3 /*break*/, 4];
                case 2: 
                // call to Plaid api endpoint: /item/public_token/exchange in order to obtain access_token which is then stored with the created item
                return [4 /*yield*/, api_1.exchangeToken(publicToken, metadata, props.userId)];
                case 3:
                    // call to Plaid api endpoint: /item/public_token/exchange in order to obtain access_token which is then stored with the created item
                    _a.sent();
                    getItemsByUser(props.userId, true);
                    _a.label = 4;
                case 4:
                    history.push("/user/" + props.userId);
                    return [2 /*return*/];
            }
        });
    }); };
    var onExit = function (error, metadata) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // log and save error and metatdata
                    util_1.logExit(error, metadata, props.userId);
                    if (!(error != null && error.error_code === 'INVALID_LINK_TOKEN')) return [3 /*break*/, 2];
                    return [4 /*yield*/, generateLinkToken(props.userId, props.itemId)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    var config = {
        onSuccess: onSuccess,
        onExit: onExit,
        onEvent: util_1.logEvent,
        token: props.token
    };
    if (props.isOauth) {
        config.receivedRedirectUri = window.location.href; // add additional receivedRedirectUri config when handling an OAuth reidrect
    }
    var _b = react_plaid_link_1.usePlaidLink(config), open = _b.open, ready = _b.ready;
    react_1.useEffect(function () {
        // initiallizes Link automatically if it is handling an OAuth reidrect
        if (props.isOauth && ready) {
            open();
        }
    }, [ready, open, props.isOauth]);
    var handleClick = function () {
        // regular, non-OAuth case:
        // set link token, userId and itemId in local storage for use if needed later by OAuth
        localStorage.setItem('oauthConfig', JSON.stringify({
            userId: props.userId,
            itemId: props.itemId,
            token: props.token
        }));
        open();
    };
    return (react_1["default"].createElement(react_1["default"].Fragment, null, props.isOauth ? (
    // no link button rendered: OAuth will open automatically by useEffect above
    react_1["default"].createElement(react_1["default"].Fragment, null)) : props.itemId != null ? (
    // update mode: Link is launched from dropdown menu in the
    // item card after item is set to "bad state"
    react_1["default"].createElement(Touchable_1["default"], { className: "menuOption", disabled: !ready, onClick: function () {
            handleClick();
        } }, props.children)) : (
    // regular case for initializing Link from user card or from "add another item" button
    react_1["default"].createElement(Button_1["default"], { centered: true, inline: true, small: true, disabled: !ready, onClick: function () {
            handleClick();
        } }, props.children))));
}
exports["default"] = LinkButton;
