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
exports.exchangeToken = exports.postLinkEvent = exports.getInstitutionById = exports.getTransactionsByUser = exports.getTransactionsByItem = exports.getTransactionsByAccount = exports.getAccountsByUser = exports.getAccountsByItem = exports.getLinkToken = exports.setItemToBadState = exports.setItemState = exports.deleteItemById = exports.getItemsByUser = exports.getItemById = exports.deleteUserById = exports.addNewUser = exports.getUserById = exports.getUsers = exports.getAssetsByUser = exports.addAsset = exports.getLoginUser = void 0;
var axios_1 = require("axios");
var react_1 = require("react");
var react_toastify_1 = require("react-toastify");
var components_1 = require("../components");
var baseURL = '/';
var api = axios_1["default"].create({
    baseURL: baseURL,
    headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: 0
    }
});
exports["default"] = api;
// currentUser
exports.getLoginUser = function (username) {
    return api.post('/sessions', { username: username });
};
// assets
exports.addAsset = function (userId, description, value) {
    return api.post('/assets', { userId: userId, description: description, value: value });
};
exports.getAssetsByUser = function (userId) { return api.get("/assets/" + userId); };
// users
exports.getUsers = function () { return api.get('/users'); };
exports.getUserById = function (userId) { return api.get("/users/" + userId); };
exports.addNewUser = function (username) {
    return api.post('/users', { username: username });
};
exports.deleteUserById = function (userId) {
    return api["delete"]("/users/" + userId);
};
// items
exports.getItemById = function (id) { return api.get("/items/" + id); };
exports.getItemsByUser = function (userId) {
    return api.get("/users/" + userId + "/items");
};
exports.deleteItemById = function (id) { return api["delete"]("/items/" + id); };
exports.setItemState = function (itemId, status) {
    return api.put("items/" + itemId, { status: status });
};
// This endpoint is only availble in the sandbox enviornment
exports.setItemToBadState = function (itemId) {
    return api.post('/items/sandbox/item/reset_login', { itemId: itemId });
};
exports.getLinkToken = function (userId, itemId) {
    return api.post("/link-token", {
        userId: userId,
        itemId: itemId
    });
};
// accounts
exports.getAccountsByItem = function (itemId) {
    return api.get("/items/" + itemId + "/accounts");
};
exports.getAccountsByUser = function (userId) {
    return api.get("/users/" + userId + "/accounts");
};
// transactions
exports.getTransactionsByAccount = function (accountId) {
    return api.get("/accounts/" + accountId + "/transactions");
};
exports.getTransactionsByItem = function (itemId) {
    return api.get("/items/" + itemId + "/transactions");
};
exports.getTransactionsByUser = function (userId) {
    return api.get("/users/" + userId + "/transactions");
};
// institutions
exports.getInstitutionById = function (instId) {
    return api.get("/institutions/" + instId);
};
// misc
exports.postLinkEvent = function (event) { return api.post("/link-event", event); };
exports.exchangeToken = function (publicToken, institution, accounts, userId) { return __awaiter(void 0, void 0, void 0, function () {
    var data, err_1, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, api.post('/items', {
                        publicToken: publicToken,
                        institutionId: institution.institution_id,
                        userId: userId,
                        accounts: accounts
                    })];
            case 1:
                data = (_a.sent()).data;
                return [2 /*return*/, data];
            case 2:
                err_1 = _a.sent();
                response = err_1.response;
                if (response && response.status === 409) {
                    react_toastify_1.toast.error(react_1["default"].createElement(components_1.DuplicateItemToastMessage, { institutionName: institution.name }));
                }
                else {
                    react_toastify_1.toast.error("Error linking " + institution.name);
                }
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
