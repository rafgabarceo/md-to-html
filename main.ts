enum Emphasis {
        None = 0,
        Italics = 1,
        Bold = 2,
        Boldalics = 3,
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

function parseLine(md: string) {
        // Convert all the characters into nodes
        let nodeBuffer: Array<string> = [];
        let delimiterBuffer: Array<string> = [];
        const adjList = [];
        for (let i: number = 0; i < md.length; i++) { 
                if(md[i] !== "*") {
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
                        if((md[j + 1] === "*") && (markdownTest[j + 2] !== "*")) { // Handle bold case.
                                j = j + 2;
                                offset = 2;
                        } else if((md[j + 1] === "*") && (md[j + 2] === "*")) { // Handle bold and italics case.
                                j = j + 3;
                                offset = 3;
                        } else if(md[j + 1] !== "*") { // Handle the italics case
                                j = j + 1;
                                offset = 1;
                        }
                        while(md[j] !== "*") {
                                delimiterBuffer.push(md[j]);
                                j++;
                        }

                        const innerCharsNode: Node = {
                                id: j,
                                data: delimiterBuffer.join(""),
                                emphasis: (offset == 1) ? 
                                        Emphasis.Italics : (offset == 2) ?
                                        Emphasis.Bold : (offset == 3) ? 
                                        Emphasis.Boldalics : Emphasis.None
                        }

                        delimiterBuffer = [];
                        adjList.push(innerCharsNode);
                        i = j + offset;
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
                }
        }
        return generatedHTML.join("");
}
