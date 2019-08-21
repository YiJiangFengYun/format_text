export enum FormatType {
    COLOR,
    SIZE,
    BOLD,
    ITALIC,
    COUNT,
}

export interface Format {
    begin?: number;
    end?: number;
    types: number;
    color?: number;
    size?: number;
}

export function copyFormat(out: Format, src: Format) {
    out.begin = src.begin;
    out.end = src.end;
    out.types = src.types;
    out.color = src.color;
    out.size = src.size;
}

export function cloneFormat(src: Format) {
    let newFormat: Format = {} as Format;
    copyFormat(newFormat, src);
    return newFormat;
}

export function getFormatTypeBits(type: FormatType) {
    return 1 << type;
}

export function addFormatColor(origin: Format, color: number) {
    origin.types |= getFormatTypeBits(FormatType.COLOR);
    origin.color = color;
}

export function addFormatSize(origin: Format, size: number) {
    origin.types |= getFormatTypeBits(FormatType.SIZE);
    origin.size = size;
}

export function addFormats(origin: Format, types: number) {
    origin.types |= types;
}

export function decFormats(origin: Format, types: FormatType) {
    let bitwise = (1 << FormatType.COUNT) - 1;
    origin.types &= (~types & bitwise);
}

function addFormat(origin: Format, src: Format) {
    origin.types |= src.types;
    if (src.types & getFormatTypeBits(FormatType.COLOR)) {
        origin.color = src.color;
    }

    if (src.types & getFormatTypeBits(FormatType.SIZE)) {
        origin.size = src.size;
    }
}

function decFormat(origin: Format, src: Format) {
    let bitwise = (1 << FormatType.COUNT) - 1;
    origin.types &= (~src.types & bitwise);
}

export function isSameFormat(format1: Format, format2: Format) {
    if (format1.types !== format2.types) return false;
    let types = format1.types;
    if (types & getFormatTypeBits(FormatType.COLOR)) {
        if (format1.color !== format2.color) return false;
    }
    if (types & getFormatTypeBits(FormatType.SIZE)) {
        if (format1.size !== format2.size) return false;
    }
    return true;
}

export interface Data {
    text: string;
    formats: Format[];
    brs: number[]; // Store index where it should insert br before.
}

export function create(text?: string, size: number = 20, color: number = 0xffffff): Data {
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

export function append(out: Data, src: Data) {
    let offset = out.text.length;
    out.text += src.text;
    let len = src.formats.length;
    let originLen = out.formats.length;
    let newLen = originLen + len;
    out.formats.length = newLen;
    for (let i = 0; i < len; ++i) {
        let index = i + originLen;
        out.formats[index] = {} as any;
        Object.assign(out.formats[index], src.formats[i]);
        out.formats[index].begin += offset;
        out.formats[index].end += offset;
    }

    len = src.brs.length;
    originLen = out.brs.length;
    newLen = originLen + len;
    out.brs.length = newLen;
    for (let i = 0; i < len; ++i) {
        out.brs[originLen + i] = src.brs[i] + offset;
    }

    mergeSameContiguousFormats(out);

    return out;
}

export function copy(out: Data, src: Data) {
    out.text = src.text;
    let len = out.formats.length = src.formats.length; 
    for (let i = 0; i < len; ++i) {
        if (! out.formats[i]) out.formats[i] = {} as any;
        Object.assign(out.formats[i], src.formats[i]);
    }
    out.brs = src.brs.slice();
}

export function clone(src: Data) {
    let out: Data = {
        text: "",
        formats: [],
        brs: [],
    };

    copy(out, src);
    
    return out;
}

export function setFormat(target: Data, src: Format) {
    changeFormat(target, src);
}

export function unsetFormat(target: Data, src: Format) {
    changeFormat(target, src, true);
}

export function addBR(target: Data, index: number) {
    let brs = target.brs;
    brs.push(index);
    brs.sort((a, b) => {
        return a - b;
    });
}

export function removeBR(target: Data, index: number) {
    let brs = target.brs;
    let i = brs.indexOf(index);
    if ( i >= 0) {
        brs.splice(i, 1);
    }
}

export function getFormats(target: Data, begin: number, end: number): Format[] {
    let beginSlice: number = 0;
    let endSlice: number = 0;
    let formats = target.formats;
    let formatCount = formats.length;
    for (let i = 0; i < formatCount; ++i) {
        if (begin < formats[i].end) {
            beginSlice = i;
            break;
        }
    }
    for (let i = formatCount - 1; i >= 0; --i) {
        if (end > formats[i].begin) {
            endSlice = i;
            break;
        }
    }

    let reses: Format[] = [];
    let len = endSlice - beginSlice + 1;
    formats.length = len;
    for (let i = 0; i < len; ++i) {
        reses[i] = formats[beginSlice + i];
    }
    return reses;
}

function changeFormat(target: Data, src: Format, unset?: boolean) {
    if (src.begin === src.end) return;
    let funDoFormat = unset ? decFormat : addFormat;
    let beginSlice: number = 0;
    let endSlice: number = 0;
    let formats = target.formats;
    let formatCount = formats.length;
    for (let i = 0; i < formatCount; ++i) {
        if (src.begin < formats[i].end) {
            beginSlice = i;
            break;
        }
    }
    for (let i = formatCount - 1; i >= 0; --i) {
        if (src.end > formats[i].begin) {
            endSlice = i;
            break;
        }
    }

    if (beginSlice === endSlice) {
        let originFormat = formats[beginSlice];
        let firstBegin = originFormat.begin;
        let firstEnd = src.begin;
        let secondBegin = src.begin;
        let secondEnd = src.end;
        let thirdBegin = src.end;
        let thirdEnd = originFormat.end;
        let firstFormat: Format;
        let thirdFormat: Format;
        if (firstBegin !== firstEnd) {
            firstFormat = cloneFormat(originFormat);
            firstFormat.begin = firstBegin;
            firstFormat.end = firstEnd;
            formats.splice(beginSlice, 0, firstFormat);
        }

        let secondFormat = originFormat;
        secondFormat.begin = secondBegin;
        secondFormat.end = secondEnd;
        
        if (thirdBegin !== thirdEnd) {
            thirdFormat = cloneFormat(originFormat);
            thirdFormat.begin = thirdBegin;
            thirdFormat.end = thirdEnd;
            formats.splice(beginSlice + 2, 0, thirdFormat);
        }

        funDoFormat(secondFormat, src);

    } else {
        let begin = beginSlice + 1;
        for (let i = begin; i < endSlice; ++i) {
            funDoFormat(formats[i], src);
        }

        {
            // Cut begin slice to two slice, and add the format to second slice, remain first slice the same.
            let secondFormat = formats[beginSlice];
            let secondBegin = src.begin;
            let firstEnd = src.begin;
            let firstBegin = secondFormat.begin;
            secondFormat.begin = secondBegin;
            if (firstBegin !== firstEnd) {
                let firstFormat = cloneFormat(secondFormat);
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
            let firstFormat = formats[endSlice];
            let firstEnd = src.end;
            let secondBegin = src.end;
            let secondEnd = firstFormat.end;
            firstFormat.end = firstEnd;
            if (secondBegin !== secondEnd) {
                let secondFormat =  cloneFormat(firstFormat);
                secondFormat.begin = secondBegin;
                secondFormat.end = secondEnd;
                formats.splice(endSlice + 1, 0, secondFormat);
            }
            
            funDoFormat(firstFormat, src);
        }
    }

    mergeSameContiguousFormats(target);
}

function mergeSameContiguousFormats(target: Data) {
    let curr = 0;
    let formats = target.formats;
    while (curr < formats.length - 1) {
        let currFormat = formats[curr];
        let nextFormat = formats[curr + 1];
        if (isSameFormat(currFormat, nextFormat)) {
            currFormat.end = nextFormat.end;
            formats.splice(curr + 1, 1);
        } else {
            ++curr;
        }
    }
}