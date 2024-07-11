import { parseLine, parseHeader, parseBlockQuote } from "./parse.ts";

async function convertToHTML(path: string) {
        const text = await Deno.readTextFile(path); 
        const arrayText = text.split("\n");
        for(let i = 0; i < arrayText.length; i++) {
                if(arrayText[i][0] === "#") { // Parse header
                        console.log(parseHeader(arrayText[i])); 
                } else {
                        console.log(parseLine(arrayText[i]));
                }
        }
}
convertToHTML("./test.md");
