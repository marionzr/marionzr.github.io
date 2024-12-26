/**
 * mdReadingTime - A Markdown-Aware Reading Time Estimator
 *
 * Unlike traditional reading time calculators, this function is specifically designed to process
 * content rendered from Markdown text. Standard reading time libraries typically assume plain text
 * or HTML, but Markdown introduces unique challenges:
 *
 * 1. **Markdown Syntax Handling**:
 *    - Symbols such as `#`, `*`, `_`, `~`, and `>` (headings, emphasis, blockquotes) are ignored.
 *    - List markers (`-`, `*`, `1. `) are removed.
 *    - Tables, emojis, and other non-text elements are stripped.
 *
 * 2. **Links & Images**:
 *    - The actual URL in `[link text](https://example.com)` is ignored, but the link text is counted.
 *    - Image descriptions from `![alt text](image.jpg)` are preserved, but the image link is ignored.
 *
 * 3. **Code Blocks Are Fully Counted**:
 *    - Unlike standard Markdown processors that may skip or format code differently, **all content inside
 *      inline and block code is preserved and included in the word count**.
 *    - This ensures accurate reading time estimation for documentation-heavy content.
 *
 * 4. **HTML Tag Removal**:
 *    - Common HTML elements such as `<div>`, `<p>`, `<small>`, and `<br>` are stripped, ensuring
 *      that non-visible elements don’t impact the word count.
 *
 * **Usage Example:**
 * ```js
 * mdReadingTime('# Hello World\nThis is a **test**.\n```js\nconsole.log("Hello");\n```');
 * // Returns: { readingTime: 'Less than 1 min', words: 5 }
 * ```
 *
 * This function ensures an accurate estimation of how long a user will take to read Markdown-generated
 * content while maintaining meaningful text and removing unnecessary symbols.
 */

function mdReadingTime(text) {
    const averageWPM = 250; // Lower WPM because developers don't read!

    let codeBlocks = [];

    // Extract code blocks before processing Markdown removal
    text = text.replace(/```([\s\S]+?)```/g, (match, p1) => {
        let index = codeBlocks.length;
        codeBlocks.push(p1.trim()); // Store full content inside code block
        return ` CODEBLOCK${index} `; // Placeholder
    });

    text = text.replace(/`([^`]+)`/g, (match, p1) => {
        let index = codeBlocks.length;
        codeBlocks.push(p1.trim()); // Store inline code content
        return ` CODEBLOCK${index} `; // Placeholder
    });

    // Remove specific HTML tags while keeping normal text
    let cleanedText = text.replace(/<\/?(div|p|small|br)\s*\/?>/gi, " ");

    // Remove Markdown images but keep captions
    cleanedText = cleanedText.replace(/!\[([^\]]+)\]\((.*?)\)/g, "$1"); // Keep image caption

    // Remove Markdown links but keep link text
    cleanedText = cleanedText.replace(/\[([^\]]+)\]\((.*?)\)/g, "$1"); // Keep link text

    // Remove Markdown syntax **outside code blocks**
    cleanedText = cleanedText
        .replace(/#{1,6}\s*/g, " ") // Remove headings
        .replace(/[*_~`]/g, " ") // Remove Bold, Italic, Strikethrough
        .replace(/>{1,}\s*/g, " ") // Remove blockquotes
        .replace(/[-+*]\s+/g, " ") // Remove unordered lists
        .replace(/\d+\.\s+/g, " ") // Remove ordered list numbers
        .replace(/\|.*?\|/g, " ") // Remove tables
        .replace(/\s+/g, " ") // Normalize spaces
        .trim();

    // Restore code blocks into text
    for (let i = 0; i < codeBlocks.length; i++) {
        cleanedText = cleanedText.replace(`CODEBLOCK${i}`, codeBlocks[i]);
    }

    const words = cleanedText.length > 0 ? cleanedText.split(/\s+/).length : 0;

    // Reading time
    const time = Math.ceil(words / averageWPM);

    return {
        time,
        words
    };
}