"use strict";
exports.__esModule = true;
var react_1 = require("react");
var _1 = require(".");
// Component rendered when user is redirected back to site from Oauth institution site.
// It initiates link immediately with the original link token that was set in local storage
// from the initial link initialization.
var OAuthLink = function () {
    var _a = react_1.useState(), token = _a[0], setToken = _a[1];
    var _b = react_1.useState(-100), userId = _b[0], setUserId = _b[1]; // set for typescript
    var _c = react_1.useState(), itemId = _c[0], setItemId = _c[1];
    var oauthObject = localStorage.getItem('oauthConfig');
    if (typeof oauthObject === 'string') {
        setUserId(JSON.parse(oauthObject).userId);
        setItemId(JSON.parse(oauthObject).itemId);
        setToken(JSON.parse(oauthObject).token);
    }
    return (react_1["default"].createElement(react_1["default"].Fragment, null, token != null && (react_1["default"].createElement(_1.LinkButton, { isOauth // this will initiate link immediately
        : true, userId: userId, itemId: itemId, token: token }))));
};
exports["default"] = OAuthLink;
