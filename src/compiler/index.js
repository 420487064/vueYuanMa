const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
const startTagOpen = new RegExp(`^<${qnameCapture}`);
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const attribut1 = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;

const startTagClose = /^\s*(\/?)>/; 
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

function parseHTML(html) {

    //  console.log(html.match(attribut1));

    function advance(n) {
        html = html.substring(n);
    }
    function parseStartTag() {
        const start = html.match(startTagOpen);
        // console.log(start);
        if (start) {
            const match = {
                tagName: start[1], // 标签名
                attrs: [] 
            }
            advance(start[0].length)
        
            // 如果不是开始标签就一直匹配下去
            let attr,end;
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                advance(attr[0].length)
                console.log("attr",attr);
                match.attrs.push({name:attr[1],value:attr[3] || attr[4] || attr[5] || true})
                
            }

            if (end) {
                advance(end[0].length)
            }

            // console.log("endhtml",html);
            
        }

        return false;
    }
    while (html) {
        let textEnd = html.indexOf('<');
        if(textEnd == 0){
            const startTagMatch = parseStartTag();
            if (startTagMatch) {
                continue
            }
            break;
        }
    }
}


export function compilerToFunction(template) {
    let ast = parseHTML(template);
    console.log("template",ast);
}