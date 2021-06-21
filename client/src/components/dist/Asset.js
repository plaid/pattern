"use strict";
exports.__esModule = true;
var react_1 = require("react");
var Modal_1 = require("plaid-threads/Modal");
var ModalBody_1 = require("plaid-threads/ModalBody");
var Button_1 = require("plaid-threads/Button");
var TextInput_1 = require("plaid-threads/TextInput");
var NumberInput_1 = require("plaid-threads/NumberInput");
var services_1 = require("../services");
//  Allows user to input their personal assets such as a house or car.
function Asset(props) {
    var _a = react_1.useState(false), show = _a[0], setShow = _a[1];
    var _b = react_1.useState(''), description = _b[0], setDescription = _b[1];
    var _c = react_1.useState(''), value = _c[0], setValue = _c[1];
    var addAsset = services_1.useAssets().addAsset;
    var handleSubmit = function () {
        setShow(false);
        addAsset(props.userId, description, parseInt(value));
    };
    return (react_1["default"].createElement("div", { className: "assetBtnContainer" },
        react_1["default"].createElement(Button_1["default"], { centered: true, inline: true, small: true, secondary: true, onClick: function () { return setShow(!show); } }, "Add An Asset"),
        react_1["default"].createElement(Modal_1["default"], { isOpen: show, onRequestClose: function () { return setShow(false); } },
            react_1["default"].createElement(react_1["default"].Fragment, null,
                react_1["default"].createElement(ModalBody_1["default"], { onClickCancel: function () { return setShow(false); }, header: "Enter Your Asset", isLoading: false, onClickConfirm: handleSubmit, confirmText: "Submit", 
                    // TODO: file ticket in threads to fix body type
                    // @ts-ignore
                    body: react_1["default"].createElement(react_1["default"].Fragment, null,
                        react_1["default"].createElement(TextInput_1["default"], { label: "", id: "id-6", placeholder: "Enter Asset Description (e.g. house or car)", value: description, onChange: function (e) { return setDescription(e.currentTarget.value); } }),
                        react_1["default"].createElement(NumberInput_1["default"], { label: "", id: "id-6", placeholder: "Enter Asset Value (in dollars $)", value: value, onChange: function (e) { return setValue(e.currentTarget.value); } })) },
                    react_1["default"].createElement(react_1["default"].Fragment, null,
                        react_1["default"].createElement(TextInput_1["default"], { label: "", id: "id-6", placeholder: "Enter Asset Description (e.g. house or car)", value: description, onChange: function (e) { return setDescription(e.currentTarget.value); } }),
                        react_1["default"].createElement(NumberInput_1["default"], { label: "", id: "id-6", placeholder: "Enter Asset Value (in dollars $)", value: value, onChange: function (e) { return setValue(e.currentTarget.value); } })))))));
}
exports["default"] = Asset;
