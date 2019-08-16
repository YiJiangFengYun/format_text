export declare enum FormatType {
    UNDEFINED = 0,
    COLOR = 1,
    SIZE = 2,
    BOLD = 4,
    ITALIC = 8,
    BR = 16
}
export interface Format {
    start?: number;
    end?: number;
    types: number;
    color?: number;
    size?: number;
}
export interface Data {
    text: string;
    formats: Format[];
}
export declare function create(text?: string, size?: number, color?: number): Data;
