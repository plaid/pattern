"use strict";
exports.__esModule = true;
var react_1 = require("react");
var DuplicateItemToastMessage = function (props) { return (react_1["default"].createElement(react_1["default"].Fragment, null,
    react_1["default"].createElement("div", null, props.institutionName + " already linked."),
    react_1["default"].createElement("a", { className: "toast__link", href: "https://github.com/plaid/pattern/tree/master/server#preventing-item-duplication", target: "_blank", rel: "noopener noreferrer" }, "Click here"),
    ' ',
    "for more info.")); };
exports["default"] = DuplicateItemToastMessage;
