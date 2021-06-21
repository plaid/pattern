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
exports.CurrentUserProvider = void 0;
var react_1 = require("react");
var react_toastify_1 = require("react-toastify");
var react_router_dom_1 = require("react-router-dom");
var api_1 = require("./api");
var initialState = {
    currentUser: {},
    newUser: null
};
var CurrentUserContext = react_1.createContext(initialState);
/**
 * @desc Maintains the currentUser context state and provides functions to update that state
 */
function CurrentUserProvider(props) {
    var _this = this;
    var _a = react_1.useReducer(reducer, initialState), userState = _a[0], dispatch = _a[1];
    var history = react_router_dom_1.useHistory();
    /**
     * @desc Requests details for a single User.
     */
    var login = react_1.useCallback(function (username) { return __awaiter(_this, void 0, void 0, function () {
        var payload, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, api_1.getLoginUser(username)];
                case 1:
                    payload = (_a.sent()).data;
                    if (payload != null) {
                        react_toastify_1.toast.success("Successful login.  Welcome back " + username);
                        dispatch({ type: 'SUCCESSFUL_GET', payload: payload });
                        history.push("/user/" + payload[0].id);
                    }
                    else {
                        react_toastify_1.toast.error("Username " + username + " is invalid.  Try again. ");
                        dispatch({ type: 'FAILED_GET' });
                    }
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    console.log(err_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); }, [history]);
    var setCurrentUser = react_1.useCallback(function (username) { return __awaiter(_this, void 0, void 0, function () {
        var payload, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, api_1.getLoginUser(username)];
                case 1:
                    payload = (_a.sent()).data;
                    if (payload != null) {
                        dispatch({ type: 'SUCCESSFUL_GET', payload: payload[0] });
                        history.push("/user/" + payload[0].id);
                    }
                    else {
                        dispatch({ type: 'FAILED_GET' });
                    }
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _a.sent();
                    console.log(err_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); }, [history]);
    var setNewUser = react_1.useCallback(function (username) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            dispatch({ type: 'ADD_USER', payload: username });
            return [2 /*return*/];
        });
    }); }, []);
    /**
     * @desc Builds a more accessible state shape from the Users data. useMemo will prevent
     * these from being rebuilt on every render unless usersById is updated in the reducer.
     */
    var value = react_1.useMemo(function () {
        return {
            userState: userState,
            login: login,
            setCurrentUser: setCurrentUser,
            setNewUser: setNewUser
        };
    }, [userState, login, setCurrentUser, setNewUser]);
    return react_1["default"].createElement(CurrentUserContext.Provider, __assign({ value: value }, props));
}
exports.CurrentUserProvider = CurrentUserProvider;
/**
 * @desc Handles updates to the Users state as dictated by dispatched actions.
 */
function reducer(state, action) {
    switch (action.type) {
        case 'SUCCESSFUL_GET':
            return {
                currentUser: action.payload,
                newUser: null
            };
        case 'FAILED_GET':
            return __assign(__assign({}, state), { newUser: null });
        case 'ADD_USER':
            return __assign(__assign({}, state), { newUser: action.payload });
        default:
            console.warn('unknown action: ', action.type, action.payload);
            return state;
    }
}
/**
 * @desc A convenience hook to provide access to the Users context state in components.
 */
function useCurrentUser() {
    var context = react_1.useContext(CurrentUserContext);
    if (!context) {
        throw new Error("useUsers must be used within a UsersProvider");
    }
    return context;
}
exports["default"] = useCurrentUser;
