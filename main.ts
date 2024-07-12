import { parseLine, parseHeader, parseBlockQuote } from "./parse.ts";

async function convertToHTML(path: string) {
        let paragraphCounter: number = 0;
        const html: Array<string> = [];
        const text = await Deno.readTextFile(path); 
        const arrayText = text.split("\n");
        for(let i = 0; i < arrayText.length; i++) {
                arrayText[i].trim();
                if(arrayText[i][0] === "#") { // Parse header
                        html.push(parseHeader(arrayText[i]));
                        continue;
                }

                if(arrayText[i] === "") {
                        if(paragraphCounter === 0) {
                                html.push("<p>");
                                paragraphCounter++; 
                        } else if(paragraphCounter === 1){
                                html.push("</p>");
                                paragraphCounter--; 
                        }
                        continue;
                }
                html.push(parseLine(arrayText[i]));
        }

        return html.join("");
}

async function main() {
        const convertedHTML = await convertToHTML("./test.md");
        console.log(convertedHTML);
}

main();
