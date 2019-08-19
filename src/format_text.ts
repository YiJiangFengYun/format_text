import * as modData from "./data";

export class FormatText {
    public data: modData.Data = modData.create("");

    public constructor() {

    }

    public init(data: modData.Data) {
        modData.copy(this.data, data);
    }

    public initFromJsonStr(dataStr: string) {
        this.data = JSON.parse(dataStr);
    }

    public setColor(begin: number, end: number, color: number) {
        modData.setFormat(this.data, {
            begin: begin,
            end: end,
            types: modData.getFormatTypeBits(modData.FormatType.COLOR),
            color: color,
        });
    }

    public setSize(begin: number, end: number, size: number) {
        modData.setFormat(this.data, {
            begin: begin,
            end: end,
            types: modData.getFormatTypeBits(modData.FormatType.SIZE),
            size: size,
        });
    }

    public setBold(begin: number, end: number) {
        modData.setFormat(this.data, {
            begin: begin,
            end: end,
            types: modData.getFormatTypeBits(modData.FormatType.BOLD),
        });
    }

    public unsetBold(begin: number, end: number) {
        modData.unsetFormat(this.data, {
            begin: begin,
            end: end,
            types: modData.getFormatTypeBits(modData.FormatType.BOLD),
        });
    }

    public setItalic(begin: number, end: number) {
        modData.setFormat(this.data, {
            begin: begin,
            end: end,
            types: modData.getFormatTypeBits(modData.FormatType.ITALIC),
        });
    }

    public unsetItalic(begin: number, end: number) {
        modData.unsetFormat(this.data, {
            begin: begin,
            end: end,
            types: modData.getFormatTypeBits(modData.FormatType.ITALIC),
        });
    }

    public addBR(index: number) {
        modData.addBR(this.data, index);
    }

    public removeBR(index: number) {
        modData.removeBR(this.data, index);
    }

    public toString() {
        return this.data.text;
    }

    /**
     * Get rich text for cocos creator.
     */
    public toCCRichText(begin: number, end: number) {
        if (begin === end) return "";
        let data = this.data;
        let text = data.text;
        let formats = data.formats;
        let formatCount = formats.length;
        let brs = data.brs;
        let brCount = brs.length;
        let brStart = 0;

        let result: string = "";
        for (let i = 0; i < formatCount; ++i) {
            let format = formats[i];
            if (format.end > begin || format.begin < end ) {
                let subBegin = Math.max(begin, format.begin);
                let subEnd = Math.min(end, format.end);
                let subResult = "";
                for (let j = brStart; j < brCount; ++j) {
                    let index = brs[j];
                    if (index < subEnd) {
                        let temp = index - 1;
                        subResult += text.substring(subBegin, temp);
                        subResult += "<br/>"
                        subBegin = temp;
                    } else {
                        brStart = j;
                        break;
                    }
                }
                subResult += text.substring(subBegin, subEnd);
                if (format.types | modData.getFormatTypeBits(modData.FormatType.COLOR)) {
                    subResult += `<color=#${format.color.toString(16)}>${subResult}</color>`;
                }
                if (format.types | modData.getFormatTypeBits(modData.FormatType.SIZE)) {
                    subResult += `<size=${format.size}>${subResult}</size>`;
                }
                if (format.types | modData.getFormatTypeBits(modData.FormatType.BOLD)) {
                    subResult += `<b>${subResult}</b>`;
                }
                if (format.types | modData.getFormatTypeBits(modData.FormatType.ITALIC)) {
                    subResult += `<i>${subResult}</i>`;
                }
                result += subResult;
            } else if (format.begin >= end) {
                break;
            }
        }

        return result;
    }
}