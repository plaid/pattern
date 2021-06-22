"use strict";
exports.__esModule = true;
var react_1 = require("react");
var util_1 = require("../util");
var _1 = require(".");
function NetWorth(props) {
    // sums of account types
    var addAllAccounts = function (accountSubtypes) {
        return props.accounts
            .filter(function (a) { return accountSubtypes.includes(a.subtype); })
            .reduce(function (acc, val) { return acc + val.current_balance; }, 0);
    };
    var depository = addAllAccounts([
        'checking',
        'savings',
        'cd',
        'money market',
    ]);
    var investment = addAllAccounts(['ira', '401k']);
    var loan = addAllAccounts(['student', 'mortgage']);
    var credit = addAllAccounts(['credit card']);
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
