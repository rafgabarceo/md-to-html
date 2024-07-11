enum Emphasis {
        None = 0,
        Italics = 1,
        Bold = 2,
        Boldalics = 3,
        Code = 4,
}

interface Node {
        id: number;
        data: string;
        emphasis: number|null;
}

// TODO: Handle the blockquote case
// TODO: Handle the code case
function parseHeader(md: string): string {
        let counter: number = 0;
        let innerText:Array<string> = Array.from(md).filter((char) => {
                if(char === "#") {
                        counter++;
                        return false
                } else {
                        return true;
                }
        });
        return `<h${counter}>${innerText.join("")}</h${counter}>`;
}

function parseBlockQuote(md: Array<string>) {
        const codeBuffer: Array<string> = [];
        for(let i = 0; i < md.length; i++) {
                const newArray = Array.from(md[i]).filter((char: string) => {
                        if(char === ">") {
                                return false;
                        } else return true;
                })
                codeBuffer.push(newArray.join(""));
        }
        const innerText = codeBuffer.join("\n");
        return `<blockquote>\n${innerText}\n</blockquote>`;
}

function parseLine(md: string): string {
        // Convert all the characters into nodes
        let nodeBuffer: Array<string> = [];
        let delimiterBuffer: Array<string> = [];
        const adjList = [];
        for (let i: number = 0; i < md.length; i++) { 
                if(md[i] !== "*" && md[i] !== "`") {
                        nodeBuffer.push(md[i]);
                } else {
                        // Flush the node buffer into its own node.
                        const node: Node = {
                                id: i,
                                data: nodeBuffer.join(""),
                                emphasis: Emphasis.None 

                        };
                        adjList.push(node);
                        nodeBuffer = [];
                        let j: number = i;
                        let offset: number = 0;
                        const isCode: boolean = (md[i] === "`") ? true : false;
                        if((md[j + 1] === "*") && (md[j + 2] !== "*")) { // Handle bold case.
                                j = j + 2;
                                offset = 2;
                        } else if((md[j + 1] === "*") && (md[j + 2] === "*")) { // Handle bold and italics case.
                                j = j + 3;
                                offset = 3;
                        } else if(md[j + 1] !== "*" || isCode) { // Handle the italics or code case
                                j = j + 1;
                                offset = 1;
                        }

                        const stopFlag: string = isCode ? "`" : "*"; 
                                
                        while(md[j] !== stopFlag) {
                                delimiterBuffer.push(md[j]);
                                j++;
                        }
                        const innerCharsNode: Node = {
                                id: j,
                                data: delimiterBuffer.join(""),
                                emphasis: ((offset === 1) && (!isCode)) ? Emphasis.Italics : 
                                        ((offset === 1) && (isCode)) ? Emphasis.Code: 
                                        (offset === 2) ? Emphasis.Bold : 
                                        (offset === 3) ? Emphasis.Boldalics : Emphasis.None
                        }

                        delimiterBuffer = [];
                        adjList.push(innerCharsNode);
                        i = j + (offset - 1);
                } 
        }

        const generatedHTML: Array<string> = [];
        for (let i = 0; i < adjList.length; i++) {
                switch(adjList[i].emphasis) {
                        case 0: {
                                generatedHTML.push(adjList[i].data);
                                break;
                        }
                        case 1: {
                                generatedHTML.push(`<i>${adjList[i].data}</i>`);
                                break;
                        }
                        case 2: {
                                generatedHTML.push(`<b>${adjList[i].data}</b>`);
                                break;
                        }
                        case 3: {
                                generatedHTML.push(`<b><i>${adjList[i].data}</b></i>`);
                                break;
                        }
                        case 4: {
                                generatedHTML.push(`<code>${adjList[i].data}</code>`);
                                break;
                        }
                }
        }
        return generatedHTML.join("");
}

let line = "The *quick* brown **fox** jumps `over` the ***lazy dog***";
console.log(parseLine(line));
