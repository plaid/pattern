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
var TextInput_1 = require("plaid-threads/TextInput");
var services_1 = require("../services");
var AddUserForm = function (props) {
    var _a = react_1.useState(''), username = _a[0], setUsername = _a[1];
    var _b = services_1.useUsers(), addNewUser = _b.addNewUser, getUsers = _b.getUsers;
    var setNewUser = services_1.useCurrentUser().setNewUser;
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    return [4 /*yield*/, addNewUser(username)];
                case 1:
                    _a.sent();
                    setNewUser(username);
                    props.hideForm();
                    return [2 /*return*/];
            }
        });
    }); };
    react_1.useEffect(function () {
        getUsers();
    }, [addNewUser, getUsers]);
    return (react_1["default"].createElement("div", { className: "box addUserForm" },
        react_1["default"].createElement("form", { onSubmit: handleSubmit },
            react_1["default"].createElement("div", { className: "card" },
                react_1["default"].createElement("div", { className: "add-user__column-1" },
                    react_1["default"].createElement("h3", { className: "heading add-user__heading" }, "Add a new user"),
                    react_1["default"].createElement("p", { className: "value add-user__value" }, "Enter your name in the input field.")),
                react_1["default"].createElement("div", { className: "add-user__column-2" },
                    react_1["default"].createElement(TextInput_1["default"], { id: "username", name: "username", required: true, autoComplete: "off", className: "input_field", value: username, placeholder: "New user name", label: "User_Name", onChange: function (e) { return setUsername(e.target.value); } })),
                react_1["default"].createElement("div", { className: "add-user__column-3" },
                    react_1["default"].createElement(Button_1["default"], { className: "add-user__button", centered: true, small: true, type: "submit" }, "Add User"),
                    react_1["default"].createElement(Button_1["default"], { className: "add-user__button", centered: true, small: true, secondary: true, onClick: props.hideForm }, "Cancel"))))));
};
exports["default"] = AddUserForm;
