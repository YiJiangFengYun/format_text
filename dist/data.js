"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FormatType;
(function (FormatType) {
    FormatType[FormatType["UNDEFINED"] = 0] = "UNDEFINED";
    FormatType[FormatType["COLOR"] = 1] = "COLOR";
    FormatType[FormatType["SIZE"] = 2] = "SIZE";
    FormatType[FormatType["BOLD"] = 4] = "BOLD";
    FormatType[FormatType["ITALIC"] = 8] = "ITALIC";
    FormatType[FormatType["BR"] = 16] = "BR";
})(FormatType = exports.FormatType || (exports.FormatType = {}));
function create(text, size, color) {
    if (size === void 0) { size = 20; }
    if (color === void 0) { color = 0xffffff; }
    return {
        text: "",
        formats: [
            {
                start: 0,
                end: -1,
                types: FormatType.COLOR | FormatType.SIZE,
                color: color,
                size: size,
            }
        ],
    };
}
exports.create = create;
