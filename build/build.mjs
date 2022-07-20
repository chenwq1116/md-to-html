import FS from 'fs-extra';
import path from 'path';
import { create } from 'markdown-to-html-cli';
import { regxMdHref, regxImg } from './utils.mjs';

const dirJson = FS.readFileSync(path.resolve(process.cwd(), 'build/dir.json'));
const dir = JSON.parse(dirJson);
console.log(dir);
const deployDir = path.resolve(process.cwd(), dir.deployDir);
const deployHtmlDir = path.resolve(deployDir, dir.deployHtmlDir);
const deployHtmlPublicDir = path.resolve(deployHtmlDir, dir.deployHtmlPublicDir);

const docDir = path.resolve(process.cwd(), dir.docDir);
const docPublicDir = path.resolve(docDir, dir.docPublicDir);
const nginxDir = path.resolve(process.cwd(), dir.nginxDir);
const nginxWinDir = path.resolve(nginxDir, dir.nginxWinDir);

const hrefHost = dir.hrefHost;

let pathAll = [];

initDir();
copyPublicFile();
readMarkdownPaths(docDir);
createMdToHtml(pathAll);

function initDir() {
    try {
        FS.ensureDirSync(deployDir);
        FS.emptyDirSync(deployDir);
        FS.ensureDirSync(docDir);
        FS.ensureDirSync(nginxDir);
        FS.ensureDirSync(nginxWinDir);
        FS.copySync(nginxWinDir, deployDir);
    } catch (error) {
        console.log(error);
    }
}

function copyPublicFile() {
    FS.copySync(docPublicDir, deployHtmlPublicDir);
}

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
        console.log(filepath + ':' + err.errno);
    }
}

/**
 *  read .md and create html
 * @param {array} pathArr 
 */
function createMdToHtml(pathArr) {
    pathArr.forEach((mdPath, i) => {
        let htmlPath = mdPath.replace(docDir, deployHtmlDir);
        htmlPath = replaceIndexHtml(htmlPath);
        htmlPath = htmlPath.replace('.md', '.html');
        const con = FS.readFileSync(mdPath);
        let str = con.toString();
        str = replaceMdHref(str);
        const html = create({
            markdown: str,
        });
        FS.outputFileSync(htmlPath, html);
    });
}

function replaceMdHref(str) {
    const hrefArr = regxMdHref(str, hrefHost);
    const imgArr = regxImg(str, hrefHost);
    const allArr = hrefArr.concat(imgArr);
    allArr.forEach(element => {
        str = str.replace(element.subStr, element.newSubStr)
    });
    return str;
}

function replaceIndexHtml(htmlPath){
    if(htmlPath.includes(dir.indexFile)){
        htmlPath = htmlPath.replace(dir.indexFile, 'index.md');
    }
    return htmlPath;
}