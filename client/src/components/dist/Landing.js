"use strict";
exports.__esModule = true;
var react_1 = require("react");
var Button_1 = require("plaid-threads/Button");
var react_router_dom_1 = require("react-router-dom");
var services_1 = require("../services");
var _1 = require(".");
var hooks_1 = require("../hooks");
function Landing() {
    var _a = services_1.useUsers(), getUsers = _a.getUsers, usersById = _a.usersById;
    var _b = services_1.useCurrentUser(), userState = _b.userState, setCurrentUser = _b.setCurrentUser;
    var _c = hooks_1.useBoolean(false), isAdding = _c[0], hideForm = _c[1], toggleForm = _c[2];
    var history = react_router_dom_1.useHistory();
    react_1.useEffect(function () {
        getUsers();
    }, [getUsers, usersById]);
    react_1.useEffect(function () {
        if (userState.newUser != null) {
            setCurrentUser(userState.newUser);
        }
    }, [getUsers, usersById, setCurrentUser, userState.newUser]);
    var returnToCurrentUser = function () {
        history.push("/user/" + userState.currentUser.id);
    };
    return (react_1["default"].createElement("div", null,
        react_1["default"].createElement(_1.Banner, { initialSubheading: true }),
        react_1["default"].createElement("div", { className: "btnsContainer" },
            react_1["default"].createElement(_1.Login, null),
            react_1["default"].createElement(Button_1["default"], { className: "btnWithMargin", onClick: toggleForm, centered: true, inline: true }, "Add New User"),
            userState.currentUser.username != null && (react_1["default"].createElement(Button_1["default"], { className: "btnWithMargin", centered: true, inline: true, onClick: returnToCurrentUser }, "Return to Current User"))),
        isAdding && react_1["default"].createElement(_1.AddUserForm, { hideForm: hideForm })));
}
exports["default"] = Landing;
