import { Data } from "./data";
export declare class FormatText {
    data: Data;
    constructor();
    setColor(begin: number, end: number, color: number): void;
    setSize(begin: number, end: number, size: number): void;
    setBold(begin: number, end: number): void;
    unsetBold(begin: number, end: number): void;
    setItalic(begin: number, end: number): void;
    unsetItalic(begin: number, end: number): void;
    insertBR(index: number): void;
}
