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
    public toCCRichText() {

    }
}