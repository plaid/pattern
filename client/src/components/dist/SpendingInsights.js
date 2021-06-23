"use strict";
exports.__esModule = true;
var react_1 = require("react");
var prop_types_1 = require("prop-types");
var util_1 = require("../util");
var _1 = require(".");
SpendingInsights.propTypes = {
    transactions: prop_types_1["default"].array
};
function SpendingInsights(props) {
    // grab transactions from most recent month and filter out transfers and payments
    var today = new Date();
    var transactions = props.transactions;
    var oneMonthAgo = new Date(new Date().setDate(today.getDate() - 30));
    var monthlyTransactions = react_1.useMemo(function () {
        return transactions.filter(function (tx) {
            var date = new Date(tx.date);
            return (date > oneMonthAgo &&
                tx.category !== 'Payment' &&
                tx.category !== 'Transfer' &&
                tx.category !== 'Interest');
        });
    }, [transactions, oneMonthAgo]);
    // create category and name objects from transactions
    var categoriesObject = react_1.useMemo(function () {
        return monthlyTransactions.reduce(function (obj, tx) {
            tx.category in obj
                ? (obj[tx.category] = tx.amount + obj[tx.category])
                : (obj[tx.category] = tx.amount);
            return obj;
        }, {});
    }, [monthlyTransactions]);
    var namesObject = react_1.useMemo(function () {
        return monthlyTransactions.reduce(function (obj, tx) {
            tx.name in obj
                ? (obj[tx.name] = tx.amount + obj[tx.name])
                : (obj[tx.name] = tx.amount);
            return obj;
        }, {});
    }, [monthlyTransactions]);
    // sort names by spending totals
    var sortedNames = react_1.useMemo(function () {
        var namesArray = [];
        for (var name in namesObject) {
            namesArray.push([name, namesObject[name]]);
        }
        namesArray.sort(function (a, b) { return b[1] - a[1]; });
        namesArray.splice(5); // top 5
        return namesArray;
    }, [transactions, namesObject]);
    return (react_1["default"].createElement("div", null,
        react_1["default"].createElement("h2", { className: "monthlySpendingHeading" }, "Monthly Spending"),
        react_1["default"].createElement("div", { className: "monthlySpendingContainer" },
            react_1["default"].createElement("div", { className: "userDataBox" },
                react_1["default"].createElement(_1.CategoriesChart, { categories: categoriesObject })),
            react_1["default"].createElement("div", { className: "userDataBox" },
                react_1["default"].createElement("div", { className: "holdingsList" },
                    react_1["default"].createElement("h4", { className: "holdingsHeading" }, "Top 5 Vendors"),
                    react_1["default"].createElement("div", { className: "data" },
                        react_1["default"].createElement("p", { className: "title" }, "Vendor"),
                        " ",
                        react_1["default"].createElement("p", { className: "title" }, "Amount"),
                        sortedNames.map(function (vendor) { return (react_1["default"].createElement(react_1["default"].Fragment, null,
                            react_1["default"].createElement("p", null, vendor[0]),
                            react_1["default"].createElement("p", null, util_1.currencyFilter(vendor[1])))); })))))));
}
exports["default"] = SpendingInsights;
