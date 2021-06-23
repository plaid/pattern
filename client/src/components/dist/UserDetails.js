"use strict";
exports.__esModule = true;
var react_1 = require("react");
var util_1 = require("../util");
var util_2 = require("../util");
var UserDetails = function (props) {
    console.log(props.numOfItems);
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement("div", { className: "user-card__column-1" },
            react_1["default"].createElement("h3", { className: "heading" }, "User_ID"),
            react_1["default"].createElement("p", { className: "value" }, props.user.id)),
        react_1["default"].createElement("div", { className: "user-card__column-2" },
            react_1["default"].createElement("h3", { className: "heading" }, "User_NAME"),
            react_1["default"].createElement("p", { className: "value" }, props.user.username)),
        react_1["default"].createElement("div", { className: "user-card__column-3" },
            react_1["default"].createElement("h3", { className: "heading" }, "CREATED_AT"),
            react_1["default"].createElement("p", { className: "value" }, util_2.formatDate(props.user.created_at))),
        react_1["default"].createElement("div", { className: "user-card__column-4" },
            react_1["default"].createElement("h3", { className: "heading" }, "LINKED_ITEMS"),
            react_1["default"].createElement("p", { className: "value" },
                props.hovered ? 'View ' : '',
                ' ', props.numOfItems + " " + util_1.pluralize('item', props.numOfItems)))));
};
exports["default"] = UserDetails;
