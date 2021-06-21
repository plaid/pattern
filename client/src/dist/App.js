"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var react_toastify_1 = require("react-toastify");
require("react-toastify/dist/ReactToastify.min.css");
var components_1 = require("./components");
var accounts_1 = require("./services/accounts");
var institutions_1 = require("./services/institutions");
var items_1 = require("./services/items");
var link_1 = require("./services/link");
var transactions_1 = require("./services/transactions");
var users_1 = require("./services/users");
var currentUser_1 = require("./services/currentUser");
var assets_1 = require("./services/assets");
require("./App.scss");
function App() {
    react_toastify_1.toast.configure({
        autoClose: 8000,
        draggable: false,
        toastClassName: 'box toast__background',
        bodyClassName: 'toast__body',
        hideProgressBar: true
    });
    return (react_1["default"].createElement("div", { className: "App" },
        react_1["default"].createElement(institutions_1.InstitutionsProvider, null,
            react_1["default"].createElement(items_1.ItemsProvider, null,
                react_1["default"].createElement(link_1.LinkProvider, null,
                    react_1["default"].createElement(accounts_1.AccountsProvider, null,
                        react_1["default"].createElement(transactions_1.TransactionsProvider, null,
                            react_1["default"].createElement(users_1.UsersProvider, null,
                                react_1["default"].createElement(currentUser_1.CurrentUserProvider, null,
                                    react_1["default"].createElement(assets_1.AssetsProvider, null,
                                        react_1["default"].createElement(components_1.Sockets, null),
                                        react_1["default"].createElement(react_router_dom_1.Switch, null,
                                            react_1["default"].createElement(react_router_dom_1.Route, { exact: true, path: "/", component: components_1.Landing }),
                                            react_1["default"].createElement(react_router_dom_1.Route, { path: "/user/:userId", component: components_1.UserPage }),
                                            react_1["default"].createElement(react_router_dom_1.Route, { path: "/oauth-link", component: components_1.OAuthLink }),
                                            react_1["default"].createElement(react_router_dom_1.Route, { path: "/admin", component: components_1.UserList }))))))))))));
}
exports["default"] = react_router_dom_1.withRouter(App);
