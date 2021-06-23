"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_router_hash_link_1 = require("react-router-hash-link");
var Button_1 = require("plaid-threads/Button");
var Touchable_1 = require("plaid-threads/Touchable");
var _1 = require(".");
var services_1 = require("../services");
function UserCard(props) {
    var _a = react_1.useState(0), numOfItems = _a[0], setNumOfItems = _a[1];
    var _b = react_1.useState(''), token = _b[0], setToken = _b[1];
    var _c = react_1.useState(false), hovered = _c[0], setHovered = _c[1];
    //@ts-ignore
    var _d = services_1.useItems(), itemsByUser = _d.itemsByUser, getItemsByUser = _d.getItemsByUser;
    var deleteUserById = services_1.useUsers().deleteUserById;
    var _e = services_1.useLink(), generateLinkToken = _e.generateLinkToken, linkTokens = _e.linkTokens;
    // update data store with the user's items
    react_1.useEffect(function () {
        if (props.user.id) {
            getItemsByUser(props.user.id, true);
        }
    }, [getItemsByUser, props.user.id]);
    // update no of items from data store
    react_1.useEffect(function () {
        if (itemsByUser[props.user.id] != null) {
            setNumOfItems(itemsByUser[props.user.id].length);
        }
        else {
            setNumOfItems(0);
        }
    }, [itemsByUser, props.user.id]);
    // creates new link token upon change in user or number of items
    react_1.useEffect(function () {
        generateLinkToken(props.user.id, null); // itemId is null
    }, [props.user.id, numOfItems, generateLinkToken]);
    react_1.useEffect(function () {
        setToken(linkTokens.byUser[props.user.id]);
    }, [linkTokens, props.user.id, numOfItems]);
    var handleDeleteUser = function () {
        deleteUserById(props.user.id); // this will delete all items associated with a user
    };
    return (react_1["default"].createElement("div", { className: "box user-card__box", onMouseEnter: function () {
            setHovered(true);
        }, onMouseLeave: function () {
            setHovered(false);
        } },
        react_1["default"].createElement("div", { className: " card user-card" },
            react_1["default"].createElement(Touchable_1["default"], { className: "user-card-clickable", component: react_router_hash_link_1.HashLink, to: "/user/" + props.user.id + "#itemCards" },
                react_1["default"].createElement("div", { className: "user-card__detail" },
                    react_1["default"].createElement(_1.UserDetails, { hovered: hovered, user: props.user, numOfItems: numOfItems }))),
            react_1["default"].createElement("div", { className: "user-card__buttons" },
                token != null && token.length > 0 && props.linkButton && (react_1["default"].createElement(_1.LinkButton, { userId: props.user.id, token: token, itemId: null }, "Link an Item")),
                props.removeButton && (react_1["default"].createElement(Button_1["default"], { className: "remove", onClick: handleDeleteUser, small: true, inline: true, centered: true, secondary: true }, "Delete user"))))));
}
exports["default"] = UserCard;
