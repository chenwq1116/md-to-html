import FS from 'fs-extra';
import path from 'path';
import { create } from 'markdown-to-html-cli';
import { regxMdHref } from './utils.mjs';

const deployPath = path.resolve(process.cwd(), '.deploy');
const docPath = path.resolve(process.cwd(), 'doc');

let pathAll = [];
readMarkdownPaths(docPath);
// console.log(pathAll);

createMdToHtml(pathAll);

/**
 * return all `*.md` file path
 * @param {String} filepath 
 */
function readMarkdownPaths(filepath) {
    try {
        const files = FS.readdirSync(filepath);
        for (let i = 0; i < files.length; i++) {
            if (/\.md$/.test(files[i])) {
                pathAll.push(path.join(filepath, files[i]));
            } else {
                const leafPath = path.join(filepath, files[i]);
                readMarkdownPaths(leafPath);
            }
        }
    } catch (err) {
        console.log(err.errno);
    }
}

/**
 *  read .md and create html
 * @param {array} pathArr 
 */
function createMdToHtml(pathArr) {
    pathArr.forEach((mdPath, i) => {
        let htmlPath = mdPath.replace('doc','.deploy');
        htmlPath = htmlPath.replace('.md','.html');
        console.log(htmlPath);
        const con = FS.readFileSync(mdPath);
        let str = con.toString();
        str = replaceMdHref(str);
        const html = create({
          markdown: str,
        });
        FS.outputFileSync(htmlPath, html);
    });
}


//\[[\u4e00-\u9fa5]*\]\([\u4e00-\u9fa5]*\/[\u4e00-\u9fa5]*\)
//\[\S*\]\(\S*\)

function replaceMdHref(str){
    const hrefArr = regxMdHref(str);
    hrefArr.forEach(element => {
        str = str.replace(element.subStr,element.newSubStr)
    });
    return str;
}