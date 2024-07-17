import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts"
import { parseList } from "./parse.ts"

// HTML doesn't really parse whitespace.
// Let's just ignore the input whitespace in the HTML for now.
Deno.test("test list parsing", () => {
        const testLine: Array<string> = [
                "1.Item 1",
                "2.Item 2",
                "3.Item 3",
                "\t1.Child 1",
                "\t2.Child 2",
                "\t3.Child 3",
                "4.Item 4",
                "5.Item 5",
        ]

        const parsedList = parseList(testLine, true);
        const expectedLine: Array<string> = [
                "<ol>",
                "<li>Item 1</li>",
                "<li>Item 2</li>",
                "<li>Item 3</li>",
                "<ol>",
                "<li>Child 1</li>",
                "<li>Child 2</li>",
                "<li>Child 3</li>",
                "</ol>",
                "<li>Item 4</li>",
                "<li>Item 5</li>",
                "</ol>",
        ];

        const joinedTest = expectedLine.join("").trim();
        assertEquals(parsedList, joinedTest);
});
