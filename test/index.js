const modFormatText = require("../build");

let formatData = modFormatText.create("This is a test text.");
let formatText = new modFormatText.FormatText();
formatText.init(formatData);

console.log(`Format text to cc rich text: ${formatText.toCCRichText()}`);

formatText.addBR(4);
formatText.setBold(3, 10);

console.log(`Format text to cc rich text: ${formatText.toCCRichText()}`);

console.log(`Start to print:`);

let len = formatData.text.length;
for (let i = 0; i <= len; ++i) {
    console.log(`${formatText.toCCRichText(0, i)}`);
}

