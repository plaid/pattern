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
exports.ItemsProvider = void 0;
var react_1 = require("react");
var groupBy_1 = require("lodash/groupBy");
var keyBy_1 = require("lodash/keyBy");
var omit_1 = require("lodash/omit");
var omitBy_1 = require("lodash/omitBy");
var api_1 = require("./api");
var initialState = {};
var ItemsContext = react_1.createContext(initialState);
/**
 * @desc Maintains the Items context state and provides functions to update that state.
 */
function ItemsProvider(props) {
    var _this = this;
    var _a = react_1.useReducer(reducer, {}), itemsById = _a[0], dispatch = _a[1];
    var hasRequested = react_1.useRef({
        byId: {}
    });
    /**
     * @desc Requests details for a single Item.
     * The api request will be bypassed if the data has already been fetched.
     * A 'refresh' parameter can force a request for new data even if local state exists.
     */
    var getItemById = react_1.useCallback(function (id, refresh) { return __awaiter(_this, void 0, void 0, function () {
        var payload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(!hasRequested.current.byId[id] || refresh)) return [3 /*break*/, 2];
                    hasRequested.current.byId[id] = true;
                    return [4 /*yield*/, api_1.getItemById(id)];
                case 1:
                    payload = (_a.sent()).data;
                    dispatch({ type: 'SUCCESSFUL_REQUEST', payload: payload });
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); }, []);
    /**
     * @desc Requests all Items that belong to an individual User.
     */
    var getItemsByUser = react_1.useCallback(function (userId) { return __awaiter(_this, void 0, void 0, function () {
        var payload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api_1.getItemsByUser(userId)];
                case 1:
                    payload = (_a.sent()).data;
                    dispatch({ type: 'SUCCESSFUL_REQUEST', payload: payload });
                    return [2 /*return*/];
            }
        });
    }); }, []);
    /**
     * @desc Will deletes Item by itemId.
     */
    var deleteItemById = react_1.useCallback(function (id, userId) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api_1.deleteItemById(id)];
                case 1:
                    _a.sent();
                    dispatch({ type: 'SUCCESSFUL_DELETE', payload: id });
                    // Update items list after deletion.
                    return [4 /*yield*/, getItemsByUser(userId)];
                case 2:
                    // Update items list after deletion.
                    _a.sent();
                    delete hasRequested.current.byId[id];
                    return [2 /*return*/];
            }
        });
    }); }, [getItemsByUser]);
    /**
     * @desc Will delete all items that belong to an individual User.
     * There is no api request as apiDeleteItemById in items delete all related transactions
     */
    var deleteItemsByUserId = react_1.useCallback(function (userId) {
        dispatch({ type: 'DELETE_BY_USER', payload: userId });
    }, []);
    /**
     * @desc Builds a more accessible state shape from the Items data. useMemo will prevent
     * these from being rebuilt on every render unless itemsById is updated in the reducer.
     */
    var value = react_1.useMemo(function () {
        var allItems = Object.values(itemsById);
        return {
            allItems: allItems,
            itemsById: itemsById,
            itemsByUser: groupBy_1["default"](allItems, 'user_id'),
            getItemById: getItemById,
            getItemsByUser: getItemsByUser,
            deleteItemById: deleteItemById,
            deleteItemsByUserId: deleteItemsByUserId
        };
    }, [
        itemsById,
        getItemById,
        getItemsByUser,
        deleteItemById,
        deleteItemsByUserId,
    ]);
    return react_1["default"].createElement(ItemsContext.Provider, __assign({ value: value }, props));
}
exports.ItemsProvider = ItemsProvider;
/**
 * @desc Handles updates to the Items state as dictated by dispatched actions.
 */
function reducer(state, action) {
    switch (action.type) {
        case 'SUCCESSFUL_REQUEST':
            if (!action.payload.length) {
                return state;
            }
            return __assign(__assign({}, state), keyBy_1["default"](action.payload, 'id'));
        case 'SUCCESSFUL_DELETE':
            return omit_1["default"](state, [action.payload]);
        case 'DELETE_BY_USER':
            return omitBy_1["default"](state, function (items) { return items.user_id === action.payload; });
        default:
            console.warn('unknown action: ', action.type, action.payload);
            return state;
    }
}
/**
 * @desc A convenience hook to provide access to the Items context state in components.
 */
function useItems() {
    var context = react_1.useContext(ItemsContext);
    if (!context) {
        throw new Error("useItems must be used within an ItemsProvider");
    }
    return context;
}
exports["default"] = useItems;
