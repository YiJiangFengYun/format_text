"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("./data");
var FormatText = /** @class */ (function () {
    function FormatText() {
        this.data = data_1.create("");
    }
    FormatText.prototype.setColor = function (begin, end, color) {
    };
    FormatText.prototype.setSize = function (begin, end, size) {
    };
    FormatText.prototype.setBold = function (begin, end) {
    };
    FormatText.prototype.unsetBold = function (begin, end) {
    };
    FormatText.prototype.setItalic = function (begin, end) {
    };
    FormatText.prototype.unsetItalic = function (begin, end) {
    };
    FormatText.prototype.insertBR = function (index) {
    };
    return FormatText;
}());
exports.FormatText = FormatText;
