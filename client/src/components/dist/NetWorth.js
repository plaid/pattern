"use strict";
exports.__esModule = true;
var react_1 = require("react");
var util_1 = require("../util");
var _1 = require(".");
function NetWorth(props) {
    var accountTypes = {
        depository: {
            checking: 0,
            savings: 0,
            cd: 0,
            'money market': 0
        },
        investment: {
            ira: 0,
            '401k': 0
        },
        loan: {
            student: 52,
            mortgage: 0
        },
        credit: {
            'credit card': 98
        }
    };
    //create accountTypes balances object
    props.accounts.forEach(function (account) {
        //@ts-ignore
        accountTypes[account.type][account.subtype] +=
            account.current_balance;
    });
    // sums of account types
    var addAllAccounts = function (accountType) {
        return Object.values(accountType).reduce(function (a, b) { return a + b; });
    };
    var depository = addAllAccounts(accountTypes.depository);
    var investment = addAllAccounts(accountTypes.investment);
    var loan = addAllAccounts(accountTypes.loan);
    var credit = addAllAccounts(accountTypes.credit);
    var personalAssetValue = props.personalAssets.reduce(function (a, b) {
        return a + b.value;
    }, 0);
    var assets = depository + investment + personalAssetValue;
    var liabilities = loan + credit;
    return (react_1["default"].createElement("div", { className: "netWorthContainer" },
        react_1["default"].createElement("h2", { className: "netWorthHeading" }, "Net Worth"),
        react_1["default"].createElement("h4", { className: "tableSubHeading" }, "A summary of your assets and liabilities"),
        react_1["default"].createElement("div", { className: "netWorthText" }, "Your total Across " + props.numOfItems + " " + util_1.pluralize('Account', props.numOfItems)),
        react_1["default"].createElement("h2", { className: "netWorthDollars" }, util_1.currencyFilter(assets - liabilities)),
        react_1["default"].createElement("div", { className: "holdingsContainer" },
            react_1["default"].createElement("div", { className: "userDataBox" },
                react_1["default"].createElement("div", { className: "holdingsList" },
                    react_1["default"].createElement("div", { className: "assetsHeaderContainer" },
                        react_1["default"].createElement("h4", { className: "dollarsHeading" }, util_1.currencyFilter(assets)),
                        react_1["default"].createElement(_1.Asset, { userId: props.userId })),
                    react_1["default"].createElement("div", { className: "data" },
                        react_1["default"].createElement("p", { className: "title" }, "Assets"),
                        react_1["default"].createElement("p", null, ''),
                        react_1["default"].createElement("p", { className: "dataItem" }, "Cash"),
                        ' ',
                        react_1["default"].createElement("p", { className: "dataItem" }, util_1.currencyFilter(depository)),
                        react_1["default"].createElement("p", { className: "dataItem" }, "Investment"),
                        react_1["default"].createElement("p", { className: "dataItem" }, util_1.currencyFilter(investment)),
                        props.personalAssets.map(function (asset) { return (react_1["default"].createElement(react_1["default"].Fragment, null,
                            react_1["default"].createElement("p", { className: "dataItem" }, asset.description),
                            react_1["default"].createElement("p", { className: "dataItem" }, util_1.currencyFilter(asset.value)))); })))),
            react_1["default"].createElement("div", { className: "userDataBox" },
                react_1["default"].createElement("div", { className: "holdingsList" },
                    react_1["default"].createElement("h4", { className: "dollarsHeading" }, util_1.currencyFilter(liabilities)),
                    react_1["default"].createElement("div", { className: "data" },
                        react_1["default"].createElement("p", { className: "title" }, "Liabilities"),
                        react_1["default"].createElement("p", null, ''),
                        react_1["default"].createElement("p", { className: "dataItem" }, "Credit Cards"),
                        ' ',
                        react_1["default"].createElement("p", { className: "dataItem" }, util_1.currencyFilter(credit)),
                        react_1["default"].createElement("p", { className: "dataItem" }, "Loans"),
                        react_1["default"].createElement("p", { className: "dataItem" }, util_1.currencyFilter(loan))))))));
}
exports["default"] = NetWorth;
