import * as modData from "./data";
export declare class FormatText {
    data: modData.Data;
    constructor();
    init(data?: modData.Data): void;
    initFromJsonStr(dataStr: string): void;
    append(data: modData.Data): void;
    setColor(begin: number, end: number, color: number): void;
    setSize(begin: number, end: number, size: number): void;
    setBold(begin: number, end: number): void;
    unsetBold(begin: number, end: number): void;
    setItalic(begin: number, end: number): void;
    unsetItalic(begin: number, end: number): void;
    addBR(index: number): void;
    removeBR(index: number): void;
    getFormats(begin: number, end: number): modData.Format[];
    toString(): string;
    /**
     * Get rich text for cocos creator.
     */
    toCCRichText(begin?: number, end?: number): string;
}
