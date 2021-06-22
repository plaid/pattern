"use strict";
exports.__esModule = true;
var react_1 = require("react");
var startCase_1 = require("lodash/startCase");
var toLower_1 = require("lodash/toLower");
var Button_1 = require("plaid-threads/Button");
var services_1 = require("../services");
var util_1 = require("../util");
var _1 = require(".");
// const ClientMetrics: React.FC<Props> = (props: Props) => ()
// ClientMetrics.displayName = 'ClientMetrics';
// export default ClientMetrics;
function AccountCard(props) {
    var _a = react_1.useState([]), transactions = _a[0], setTransactions = _a[1];
    var _b = react_1.useState(false), transactionsShown = _b[0], setTransactionsShown = _b[1];
    var _c = services_1.useTransactions(), transactionsByAccount = _c.transactionsByAccount, getTransactionsByAccount = _c.getTransactionsByAccount;
    var id = props.account.id;
    var toggleShowTransactions = function () {
        setTransactionsShown(function (shown) { return !shown; });
    };
    react_1.useEffect(function () {
        getTransactionsByAccount(id);
    }, [getTransactionsByAccount, id]);
    react_1.useEffect(function () {
        //@ts-ignore
        setTransactions(transactionsByAccount[id] || []);
    }, [transactionsByAccount, id]);
    return (react_1["default"].createElement("div", null,
        react_1["default"].createElement("div", { className: "account-data-row" },
            react_1["default"].createElement("div", { className: "account-data-row__left" },
                react_1["default"].createElement("div", { className: "account-data-row__name" }, props.account.name),
                react_1["default"].createElement("div", { className: "account-data-row__balance" }, startCase_1["default"](toLower_1["default"](props.account.subtype)) + " \u2022 Balance " + util_1.currencyFilter(props.account.current_balance))),
            react_1["default"].createElement("div", { className: "account-data-row__right" }, transactions.length !== 0 && (react_1["default"].createElement(Button_1["default"], { onClick: toggleShowTransactions, centered: true, small: true, inline: true }, transactionsShown ? 'Hide Transactions' : 'View Transactions')))),
        transactionsShown && react_1["default"].createElement(_1.TransactionsTable, { transactions: transactions })));
}
exports["default"] = AccountCard;
