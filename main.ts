import { parseLine, parseHeader, parseBlockQuote, parseList } from "./parse.ts";

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

                if(/[0-9]\./.test(arrayText[i])) {
                        let j: number = i;
                        const listArray: Array<string> = [];
                        while(arrayText[j].match(/[0-9]\./)) {
                                listArray.push(arrayText[j]);
                                j++;
                        }
                        i = j;
                        html.push(parseList(listArray, true));
                } else if(/^(- )/.test(arrayText[i])) {
                        let j: number = i;
                        const listArray: Array<string> = [];
                        while(arrayText[j].match(/^(- )/)) {
                                listArray.push(arrayText[j]);
                                j++;
                        }
                        i = j;
                        html.push(parseList(listArray, false));
                }

                html.push(parseLine(arrayText[i]));

        }

        return html.join("");
}

export { convertToHTML }
