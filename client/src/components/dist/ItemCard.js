"use strict";
exports.__esModule = true;
var react_1 = require("react");
var Note_1 = require("plaid-threads/Note");
var Touchable_1 = require("plaid-threads/Touchable");
var _1 = require(".");
var services_1 = require("../services");
var api_1 = require("../services/api");
var util_1 = require("../util");
var PLAID_ENV = process.env.REACT_APP_PLAID_ENV || 'sandbox';
var ItemCard = function (props) {
    var _a = react_1.useState([]), accounts = _a[0], setAccounts = _a[1];
    var _b = react_1.useState({
        logo: '',
        name: '',
        institution_id: '',
        oauth: false,
        products: [],
        country_codes: []
    }), institution = _b[0], setInstitution = _b[1];
    var _c = react_1.useState(false), showAccounts = _c[0], setShowAccounts = _c[1];
    var accountsByItem = services_1.useAccounts().accountsByItem;
    var deleteAccountsByItemId = services_1.useAccounts().deleteAccountsByItemId;
    var deleteItemById = services_1.useItems().deleteItemById;
    var deleteTransactionsByItemId = services_1.useTransactions().deleteTransactionsByItemId;
    var _d = services_1.useInstitutions(), institutionsById = _d.institutionsById, getInstitutionById = _d.getInstitutionById, formatLogoSrc = _d.formatLogoSrc;
    var _e = props.item, id = _e.id, plaid_institution_id = _e.plaid_institution_id, status = _e.status;
    var isSandbox = PLAID_ENV === 'sandbox';
    var isGoodState = status === 'good';
    react_1.useEffect(function () {
        setAccounts(accountsByItem[id] || []);
    }, [accountsByItem, id]);
    react_1.useEffect(function () {
        setInstitution(institutionsById[plaid_institution_id] || {});
    }, [institutionsById, plaid_institution_id]);
    react_1.useEffect(function () {
        getInstitutionById(plaid_institution_id);
    }, [getInstitutionById, plaid_institution_id]);
    var handleSetBadState = function () {
        api_1.setItemToBadState(id);
    };
    var handleDeleteItem = function () {
        deleteItemById(id, props.userId);
        deleteAccountsByItemId(id);
        deleteTransactionsByItemId(id);
    };
    var cardClassNames = showAccounts
        ? 'card item-card expanded'
        : 'card item-card';
    return (react_1["default"].createElement("div", { className: "box" },
        react_1["default"].createElement("div", { className: cardClassNames },
            react_1["default"].createElement(Touchable_1["default"], { className: "item-card__clickable", onClick: function () { return setShowAccounts(function (current) { return !current; }); } },
                react_1["default"].createElement("div", { className: "item-card__column-1" },
                    react_1["default"].createElement("img", { className: "item-card__img", src: formatLogoSrc(institution.logo), alt: institution && institution.name }),
                    react_1["default"].createElement("p", null, institution && institution.name)),
                react_1["default"].createElement("div", { className: "item-card__column-2" }, isGoodState ? (react_1["default"].createElement(Note_1["default"], { info: true, solid: true }, "Updated")) : (react_1["default"].createElement(Note_1["default"], { error: true, solid: true }, "Login Required"))),
                react_1["default"].createElement("div", { className: "item-card__column-3" },
                    react_1["default"].createElement("h3", { className: "heading" }, "ITEM_ID"),
                    react_1["default"].createElement("p", { className: "value" }, id)),
                react_1["default"].createElement("div", { className: "item-card__column-4" },
                    react_1["default"].createElement("h3", { className: "heading" }, "LAST_UPDATED"),
                    react_1["default"].createElement("p", { className: "value" }, util_1.diffBetweenCurrentTime(props.item.updated_at)))),
            react_1["default"].createElement(_1.MoreDetails // The MoreDetails component allows developer to test the ITEM_LOGIN_REQUIRED webhook and Link update mode
            , { setBadStateShown: isSandbox && isGoodState, handleDelete: handleDeleteItem, handleSetBadState: handleSetBadState, userId: props.userId, itemId: id })),
        showAccounts && (react_1["default"].createElement("div", null, accounts.map(function (account) { return (react_1["default"].createElement("div", { key: account.id },
            react_1["default"].createElement(_1.AccountCard, { account: account }))); })))));
};
exports["default"] = ItemCard;
