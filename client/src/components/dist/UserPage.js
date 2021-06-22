"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var sortBy_1 = require("lodash/sortBy");
var NavigationLink_1 = require("plaid-threads/NavigationLink");
var Callout_1 = require("plaid-threads/Callout");
var services_1 = require("../services");
var util_1 = require("../util");
var _1 = require(".");
// provides view of user's net worth, spending by category and allows them to explore
// account and transactions details for linked items
var UserPage = function (_a) {
    var match = _a.match;
    var _b = react_1.useState({
        id: 0,
        username: '',
        created_at: '',
        updated_at: ''
    }), user = _b[0], setUser = _b[1];
    var _c = react_1.useState([]), items = _c[0], setItems = _c[1];
    var _d = react_1.useState(''), token = _d[0], setToken = _d[1];
    var _e = react_1.useState(0), numOfItems = _e[0], setNumOfItems = _e[1];
    var _f = react_1.useState([]), transactions = _f[0], setTransactions = _f[1];
    var _g = react_1.useState([]), accounts = _g[0], setAccounts = _g[1];
    var _h = react_1.useState([]), assets = _h[0], setAssets = _h[1];
    var _j = services_1.useTransactions(), getTransactionsByUser = _j.getTransactionsByUser, transactionsByUser = _j.transactionsByUser;
    var _k = services_1.useAccounts(), getAccountsByUser = _k.getAccountsByUser, accountsByUser = _k.accountsByUser;
    var _l = services_1.useAssets(), assetsByUser = _l.assetsByUser, getAssetsByUser = _l.getAssetsByUser;
    var _m = services_1.useUsers(), usersById = _m.usersById, getUserById = _m.getUserById;
    var _o = services_1.useItems(), itemsByUser = _o.itemsByUser, getItemsByUser = _o.getItemsByUser, itemsById = _o.itemsById;
    var userId = Number(match.params.userId);
    var _p = services_1.useLink(), generateLinkToken = _p.generateLinkToken, linkTokens = _p.linkTokens;
    // update data store with user
    react_1.useEffect(function () {
        getUserById(userId);
    }, [getUserById, userId]);
    // set state user from data store
    react_1.useEffect(function () {
        setUser(usersById[userId] || {});
    }, [usersById, userId]);
    react_1.useEffect(function () {
        // This gets transactions from the database only.
        // Note that calls to Plaid's transactions/get endpoint are only made in response
        // to receipt of a transactions webhook.
        getTransactionsByUser(userId);
    }, [getTransactionsByUser, userId]);
    react_1.useEffect(function () {
        setTransactions(transactionsByUser[userId] || []);
    }, [transactionsByUser, userId]);
    // update data store with the user's assets
    react_1.useEffect(function () {
        getAssetsByUser(userId);
    }, [getAssetsByUser, userId]);
    react_1.useEffect(function () {
        setAssets(assetsByUser.assets || []);
    }, [assetsByUser, userId]);
    // update data store with the user's items
    react_1.useEffect(function () {
        if (userId != null) {
            getItemsByUser(userId);
        }
    }, [getItemsByUser, userId]);
    // update state items from data store
    react_1.useEffect(function () {
        var newItems = itemsByUser[userId] || [];
        var orderedItems = sortBy_1["default"](newItems, function (item) { return new Date(item.updated_at); }).reverse();
        setItems(orderedItems);
    }, [itemsByUser, userId]);
    // update no of items from data store
    react_1.useEffect(function () {
        if (itemsByUser[userId] != null) {
            setNumOfItems(itemsByUser[userId].length);
        }
        else {
            setNumOfItems(0);
        }
    }, [itemsByUser, userId]);
    // update data store with the user's accounts
    react_1.useEffect(function () {
        getAccountsByUser(userId);
    }, [getAccountsByUser, userId]);
    react_1.useEffect(function () {
        setAccounts(accountsByUser[userId] || []);
    }, [accountsByUser, userId]);
    // creates new link token upon new user or change in number of items
    react_1.useEffect(function () {
        generateLinkToken(userId, null); // itemId is null
    }, [userId, numOfItems, generateLinkToken]);
    react_1.useEffect(function () {
        setToken(linkTokens.byUser[userId]);
    }, [linkTokens, userId, numOfItems]);
    document.getElementsByTagName('body')[0].style.overflow = 'auto'; // to override overflow:hidden from link pane
    return (react_1["default"].createElement("div", null,
        react_1["default"].createElement(NavigationLink_1["default"], { component: react_router_dom_1.Link, to: "/" }, "BACK TO LOGIN"),
        react_1["default"].createElement(_1.Banner, null),
        linkTokens.error.error_code != null && (react_1["default"].createElement(Callout_1["default"], { warning: true },
            react_1["default"].createElement("div", null, "Unable to fetch link_token: please make sure your backend server is running and that your .env file has been configured correctly."),
            react_1["default"].createElement("div", null,
                "Error Code: ",
                react_1["default"].createElement("code", null, linkTokens.error.error_code)),
            react_1["default"].createElement("div", null,
                "Error Type: ",
                react_1["default"].createElement("code", null, linkTokens.error.error_type),
                ' '),
            react_1["default"].createElement("div", null,
                "Error Message: ",
                linkTokens.error.error_message))),
        react_1["default"].createElement(_1.UserCard, { user: user, removeButton: false, linkButton: true }),
        numOfItems > 0 && (react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement(_1.NetWorth, { accounts: accounts, numOfItems: numOfItems, personalAssets: assets, userId: userId }),
            react_1["default"].createElement(_1.SpendingInsights, { transactions: transactions }),
            react_1["default"].createElement("div", { className: "item__header" },
                react_1["default"].createElement("div", null,
                    react_1["default"].createElement("h2", { className: "item__header-heading" }, items.length + " " + util_1.pluralize('Item', items.length) + " Linked"),
                    !!items.length && (react_1["default"].createElement("p", { className: "item__header-subheading" },
                        "Below is a list of all the\u00A0",
                        react_1["default"].createElement("a", { href: "https://plaid.com/docs/quickstart/#item-overview", target: "_blank", rel: "noopener noreferrer" }, "items"),
                        ". Click on an item to view its associated accounts."))),
                token != null && token.length > 0 && (
                // Link will not render unless there is a link token
                react_1["default"].createElement(_1.LinkButton, { token: token, userId: userId, itemId: null }, "Add Another Item"))),
            items.map(function (item) { return (react_1["default"].createElement("div", { id: "itemCards", key: item.id },
                react_1["default"].createElement(_1.ItemCard, { item: item, userId: userId }))); })))));
};
exports["default"] = UserPage;
