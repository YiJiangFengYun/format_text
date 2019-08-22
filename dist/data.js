"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FormatType;
(function (FormatType) {
    FormatType[FormatType["COLOR"] = 0] = "COLOR";
    FormatType[FormatType["SIZE"] = 1] = "SIZE";
    FormatType[FormatType["BOLD"] = 2] = "BOLD";
    FormatType[FormatType["ITALIC"] = 3] = "ITALIC";
    FormatType[FormatType["COUNT"] = 4] = "COUNT";
})(FormatType = exports.FormatType || (exports.FormatType = {}));
function copyFormat(out, src) {
    out.begin = src.begin;
    out.end = src.end;
    out.types = src.types;
    out.color = src.color;
    out.size = src.size;
}
exports.copyFormat = copyFormat;
function cloneFormat(src) {
    var newFormat = {};
    copyFormat(newFormat, src);
    return newFormat;
}
exports.cloneFormat = cloneFormat;
function getFormatTypeBits(type) {
    return 1 << type;
}
exports.getFormatTypeBits = getFormatTypeBits;
function addFormatColor(origin, color) {
    origin.types |= getFormatTypeBits(FormatType.COLOR);
    origin.color = color;
}
exports.addFormatColor = addFormatColor;
function addFormatSize(origin, size) {
    origin.types |= getFormatTypeBits(FormatType.SIZE);
    origin.size = size;
}
exports.addFormatSize = addFormatSize;
function addFormats(origin, types) {
    origin.types |= types;
}
exports.addFormats = addFormats;
function decFormats(origin, types) {
    var bitwise = (1 << FormatType.COUNT) - 1;
    origin.types &= (~types & bitwise);
}
exports.decFormats = decFormats;
function addFormat(origin, src) {
    origin.types |= src.types;
    if (src.types & getFormatTypeBits(FormatType.COLOR)) {
        origin.color = src.color;
    }
    if (src.types & getFormatTypeBits(FormatType.SIZE)) {
        origin.size = src.size;
    }
}
function decFormat(origin, src) {
    var bitwise = (1 << FormatType.COUNT) - 1;
    origin.types &= (~src.types & bitwise);
}
function isSameFormat(format1, format2) {
    if (format1.types !== format2.types)
        return false;
    var types = format1.types;
    if (types & getFormatTypeBits(FormatType.COLOR)) {
        if (format1.color !== format2.color)
            return false;
    }
    if (types & getFormatTypeBits(FormatType.SIZE)) {
        if (format1.size !== format2.size)
            return false;
    }
    return true;
}
exports.isSameFormat = isSameFormat;
function create(text, size, color) {
    if (size === void 0) { size = 20; }
    if (color === void 0) { color = 0xffffff; }
    text = text || "";
    return {
        text: text,
        formats: [
            {
                begin: 0,
                end: text.length,
                types: getFormatTypeBits(FormatType.COLOR) | getFormatTypeBits(FormatType.SIZE),
                color: color,
                size: size,
            }
        ],
        brs: [],
    };
}
exports.create = create;
function append(out, src) {
    var offset = out.text.length;
    out.text += src.text;
    var len = src.formats.length;
    var originLen = out.formats.length;
    var newLen = originLen + len;
    out.formats.length = newLen;
    for (var i = 0; i < len; ++i) {
        var index = i + originLen;
        out.formats[index] = {};
        Object.assign(out.formats[index], src.formats[i]);
        out.formats[index].begin += offset;
        out.formats[index].end += offset;
    }
    len = src.brs.length;
    originLen = out.brs.length;
    newLen = originLen + len;
    out.brs.length = newLen;
    for (var i = 0; i < len; ++i) {
        out.brs[originLen + i] = src.brs[i] + offset;
    }
    mergeFormats(out);
    return out;
}
exports.append = append;
function copy(out, src) {
    out.text = src.text;
    var len = out.formats.length = src.formats.length;
    for (var i = 0; i < len; ++i) {
        if (!out.formats[i])
            out.formats[i] = {};
        Object.assign(out.formats[i], src.formats[i]);
    }
    out.brs = src.brs.slice();
}
exports.copy = copy;
function clone(src) {
    var out = {
        text: "",
        formats: [],
        brs: [],
    };
    copy(out, src);
    return out;
}
exports.clone = clone;
function setFormat(target, src) {
    changeFormat(target, src);
}
exports.setFormat = setFormat;
function unsetFormat(target, src) {
    changeFormat(target, src, true);
}
exports.unsetFormat = unsetFormat;
function addBR(target, index) {
    var brs = target.brs;
    brs.push(index);
    brs.sort(function (a, b) {
        return a - b;
    });
}
exports.addBR = addBR;
function removeBR(target, index) {
    var brs = target.brs;
    var i = brs.indexOf(index);
    if (i >= 0) {
        brs.splice(i, 1);
    }
}
exports.removeBR = removeBR;
function getFormats(target, begin, end) {
    var beginSlice = 0;
    var endSlice = 0;
    var formats = target.formats;
    var formatCount = formats.length;
    for (var i = 0; i < formatCount; ++i) {
        if (begin < formats[i].end) {
            beginSlice = i;
            break;
        }
    }
    for (var i = formatCount - 1; i >= 0; --i) {
        if (end > formats[i].begin) {
            endSlice = i;
            break;
        }
    }
    var reses = [];
    var len = endSlice - beginSlice + 1;
    reses.length = len;
    for (var i = 0; i < len; ++i) {
        reses[i] = formats[beginSlice + i];
    }
    return reses;
}
exports.getFormats = getFormats;
function changeFormat(target, src, unset) {
    if (src.begin === src.end)
        return;
    var funDoFormat = unset ? decFormat : addFormat;
    var beginSlice = 0;
    var endSlice = 0;
    var formats = target.formats;
    var formatCount = formats.length;
    for (var i = 0; i < formatCount; ++i) {
        if (src.begin < formats[i].end) {
            beginSlice = i;
            break;
        }
    }
    for (var i = formatCount - 1; i >= 0; --i) {
        if (src.end > formats[i].begin) {
            endSlice = i;
            break;
        }
    }
    if (beginSlice === endSlice) {
        var originFormat = formats[beginSlice];
        var firstBegin = originFormat.begin;
        var firstEnd = src.begin;
        var secondBegin = src.begin;
        var secondEnd = src.end;
        var thirdBegin = src.end;
        var thirdEnd = originFormat.end;
        var firstFormat = void 0;
        var thirdFormat = void 0;
        if (firstBegin !== firstEnd) {
            firstFormat = cloneFormat(originFormat);
            firstFormat.begin = firstBegin;
            firstFormat.end = firstEnd;
            formats.splice(beginSlice, 0, firstFormat);
        }
        var secondFormat = originFormat;
        secondFormat.begin = secondBegin;
        secondFormat.end = secondEnd;
        if (thirdBegin !== thirdEnd) {
            thirdFormat = cloneFormat(originFormat);
            thirdFormat.begin = thirdBegin;
            thirdFormat.end = thirdEnd;
            formats.splice(beginSlice + 2, 0, thirdFormat);
        }
        funDoFormat(secondFormat, src);
    }
    else {
        var begin = beginSlice + 1;
        for (var i = begin; i < endSlice; ++i) {
            funDoFormat(formats[i], src);
        }
        {
            // Cut begin slice to two slice, and add the format to second slice, remain first slice the same.
            var secondFormat = formats[beginSlice];
            var secondBegin = src.begin;
            var firstEnd = src.begin;
            var firstBegin = secondFormat.begin;
            secondFormat.begin = secondBegin;
            if (firstBegin !== firstEnd) {
                var firstFormat = cloneFormat(secondFormat);
                firstFormat.begin = firstBegin;
                firstFormat.end = firstEnd;
                formats.splice(beginSlice, 0, firstFormat);
                ++beginSlice;
                ++endSlice;
            }
            funDoFormat(secondFormat, src);
        }
        {
            //Cut end slice to two slice, and add format to first slice, remain second slice the same.
            var firstFormat = formats[endSlice];
            var firstEnd = src.end;
            var secondBegin = src.end;
            var secondEnd = firstFormat.end;
            firstFormat.end = firstEnd;
            if (secondBegin !== secondEnd) {
                var secondFormat = cloneFormat(firstFormat);
                secondFormat.begin = secondBegin;
                secondFormat.end = secondEnd;
                formats.splice(endSlice + 1, 0, secondFormat);
            }
            funDoFormat(firstFormat, src);
        }
    }
    mergeFormats(target);
}
function mergeFormats(target) {
    var curr = 0;
    var formats = target.formats;
    while (curr < formats.length - 1) {
        var currFormat = formats[curr];
        var nextFormat = formats[curr + 1];
        if (isSameFormat(currFormat, nextFormat)) {
            currFormat.end = nextFormat.end;
            formats.splice(curr + 1, 1);
        }
        else {
            ++curr;
        }
    }
    curr = 0;
    //Delete empty format.
    while (curr < formats.length) {
        var currFormat = formats[curr];
        if (currFormat.begin == currFormat.end) {
            formats.splice(curr, 1);
        }
        else {
            ++curr;
        }
    }
}
