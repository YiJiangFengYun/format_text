"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var modData = require("./data");
var FormatText = /** @class */ (function () {
    function FormatText() {
        this.data = modData.create("");
    }
    FormatText.prototype.init = function (data) {
        modData.copy(this.data, data);
    };
    FormatText.prototype.initFromJsonStr = function (dataStr) {
        this.data = JSON.parse(dataStr);
    };
    FormatText.prototype.append = function (data) {
        modData.append(this.data, data);
    };
    FormatText.prototype.setColor = function (begin, end, color) {
        modData.setFormat(this.data, {
            begin: begin,
            end: end,
            types: modData.getFormatTypeBits(modData.FormatType.COLOR),
            color: color,
        });
    };
    FormatText.prototype.setSize = function (begin, end, size) {
        modData.setFormat(this.data, {
            begin: begin,
            end: end,
            types: modData.getFormatTypeBits(modData.FormatType.SIZE),
            size: size,
        });
    };
    FormatText.prototype.setBold = function (begin, end) {
        modData.setFormat(this.data, {
            begin: begin,
            end: end,
            types: modData.getFormatTypeBits(modData.FormatType.BOLD),
        });
    };
    FormatText.prototype.unsetBold = function (begin, end) {
        modData.unsetFormat(this.data, {
            begin: begin,
            end: end,
            types: modData.getFormatTypeBits(modData.FormatType.BOLD),
        });
    };
    FormatText.prototype.setItalic = function (begin, end) {
        modData.setFormat(this.data, {
            begin: begin,
            end: end,
            types: modData.getFormatTypeBits(modData.FormatType.ITALIC),
        });
    };
    FormatText.prototype.unsetItalic = function (begin, end) {
        modData.unsetFormat(this.data, {
            begin: begin,
            end: end,
            types: modData.getFormatTypeBits(modData.FormatType.ITALIC),
        });
    };
    FormatText.prototype.addBR = function (index) {
        modData.addBR(this.data, index);
    };
    FormatText.prototype.removeBR = function (index) {
        modData.removeBR(this.data, index);
    };
    FormatText.prototype.toString = function () {
        return this.data.text;
    };
    /**
     * Get rich text for cocos creator.
     */
    FormatText.prototype.toCCRichText = function (begin, end) {
        var data = this.data;
        var text = data.text;
        if (begin === undefined)
            begin = 0;
        if (end === undefined)
            end = text.length;
        if (begin === end)
            return "";
        var formats = data.formats;
        var formatCount = formats.length;
        var brs = data.brs;
        var brCount = brs.length;
        var brStart = 0;
        var result = "";
        for (var i = 0; i < formatCount; ++i) {
            var format = formats[i];
            if (format.end > begin || format.begin < end) {
                var subBegin = Math.max(begin, format.begin);
                var subEnd = Math.min(end, format.end);
                var subResult = "";
                for (var j = brStart; j < brCount; ++j) {
                    var index = brs[j];
                    if (index < subEnd) {
                        subResult += text.substring(subBegin, index);
                        subResult += "<br/>";
                        subBegin = index;
                        brStart = j + 1;
                    }
                    else {
                        brStart = j;
                        break;
                    }
                }
                subResult += text.substring(subBegin, subEnd);
                if (format.types & modData.getFormatTypeBits(modData.FormatType.COLOR)) {
                    subResult = "<color=#" + format.color.toString(16) + ">" + subResult + "</color>";
                }
                if (format.types & modData.getFormatTypeBits(modData.FormatType.SIZE)) {
                    subResult = "<size=" + format.size + ">" + subResult + "</size>";
                }
                if (format.types & modData.getFormatTypeBits(modData.FormatType.BOLD)) {
                    subResult = "<b>" + subResult + "</b>";
                }
                if (format.types & modData.getFormatTypeBits(modData.FormatType.ITALIC)) {
                    subResult = "<i>" + subResult + "</i>";
                }
                result += subResult;
            }
            else if (format.begin >= end) {
                break;
            }
        }
        return result;
    };
    return FormatText;
}());
exports.FormatText = FormatText;
