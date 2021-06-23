"use strict";
exports.__esModule = true;
exports.MoreDetails = void 0;
var react_1 = require("react");
var MenuS1_1 = require("plaid-threads/Icons/MenuS1");
var Dropdown_1 = require("plaid-threads/Dropdown");
var IconButton_1 = require("plaid-threads/IconButton");
var Touchable_1 = require("plaid-threads/Touchable");
var _1 = require(".");
var hooks_1 = require("../hooks");
var services_1 = require("../services");
// Provides for testing of the ITEM_LOGIN_REQUIRED webhook and Link update mode
function MoreDetails(props) {
    var _a = react_1.useState(false), menuShown = _a[0], setmenuShown = _a[1];
    var _b = react_1.useState(''), token = _b[0], setToken = _b[1];
    var refToButton = react_1.useRef(null);
    var refToMenu = hooks_1.useOnClickOutside({
        callback: function () {
            setmenuShown(false);
        },
        ignoreRef: refToButton
    });
    var _c = services_1.useLink(), generateLinkToken = _c.generateLinkToken, linkTokens = _c.linkTokens;
    // creates new link token for each item in bad state
    react_1.useEffect(function () {
        generateLinkToken(props.userId, props.itemId); // itemId is set because link is in update mode
    }, [props.userId, props.itemId, generateLinkToken]);
    react_1.useEffect(function () {
        setToken(linkTokens.byItem[props.itemId]);
    }, [linkTokens, props.itemId]);
    // display choice, depending on whether item is in "good" or "bad" state
    var linkChoice = props.setBadStateShown ? (
    // handleSetBadState uses sandbox/item/reset_login to send the ITEM_LOGIN_REQUIRED webhook;
    // app responds to this webhook by setting item to "bad" state (server/webhookHandlers/handleItemWebhook.js)
    react_1["default"].createElement(Touchable_1["default"], { className: "menuOption", onClick: props.handleSetBadState }, "Reset Login")) : token != null && token.length > 0 ? (
    // item is in "bad" state;  launch link to login and return to "good" state
    react_1["default"].createElement("div", null,
        react_1["default"].createElement(_1.LinkButton, { userId: props.userId, itemId: props.itemId, token: token }, "Update Login"))) : (react_1["default"].createElement(react_1["default"].Fragment, null));
    var icon = (react_1["default"].createElement("div", { className: "icon-button-container", ref: refToButton },
        react_1["default"].createElement(IconButton_1["default"], { accessibilityLabel: "Navigation", icon: react_1["default"].createElement(MenuS1_1["default"], null), onClick: function () { return setmenuShown(!menuShown); } })));
    return (react_1["default"].createElement("div", { className: "more-details", ref: refToMenu },
        react_1["default"].createElement(Dropdown_1["default"], { isOpen: menuShown, target: icon },
            linkChoice,
            react_1["default"].createElement(Touchable_1["default"], { className: "menuOption", onClick: props.handleDelete }, "Remove"))));
}
exports.MoreDetails = MoreDetails;
exports["default"] = MoreDetails;
