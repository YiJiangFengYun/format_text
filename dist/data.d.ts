export declare enum FormatType {
    COLOR = 0,
    SIZE = 1,
    BOLD = 2,
    ITALIC = 3,
    COUNT = 4
}
export interface Format {
    begin?: number;
    end?: number;
    types: number;
    color?: number;
    size?: number;
}
export declare function copyFormat(out: Format, src: Format): void;
export declare function cloneFormat(src: Format): Format;
export declare function getFormatTypeBits(type: FormatType): number;
export declare function addFormatColor(origin: Format, color: number): void;
export declare function addFormatSize(origin: Format, size: number): void;
export declare function addFormats(origin: Format, types: number): void;
export declare function decFormats(origin: Format, types: FormatType): void;
export declare function isSameFormat(format1: Format, format2: Format): boolean;
export interface Data {
    text: string;
    formats: Format[];
    brs: number[];
}
export declare function create(text?: string, size?: number, color?: number): Data;
export declare function append(out: Data, src: Data): Data;
export declare function copy(out: Data, src: Data): void;
export declare function clone(src: Data): Data;
export declare function setFormat(target: Data, src: Format): void;
export declare function unsetFormat(target: Data, src: Format): void;
export declare function addBR(target: Data, index: number): void;
export declare function removeBR(target: Data, index: number): void;
export declare function getFormats(target: Data, begin: number, end: number): Format[];
