import { regxMdHref, regxImg } from './utils.mjs';
import path from 'path';
import FS from 'fs-extra';

// testMdHref();
// testMdImg();
testInitDir();

function testInitDir() {
    const deployDir = path.resolve(process.cwd(), '.deploy');
    const docDir = path.resolve(process.cwd(), 'doc');
    const nginxDir = path.resolve(process.cwd(), 'nginx');
    const nginxWinDir = path.resolve(nginxDir, 'win');
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

function testMdHref() {
    const mdPath = path.resolve(process.cwd(), 'doc/逻辑架构/逻辑架构.md');
    const hrefHost = 'http://localhost/';
    const con = FS.readFileSync(mdPath);
    const str = con.toString();
    const returnArr = regxMdHref(str, hrefHost);
    console.log(returnArr);
}

function testMdImg() {
    const mdPath = path.resolve(process.cwd(), 'doc/逻辑架构/逻辑架构.md');
    const hrefHost = 'http://localhost/public/';
    const con = FS.readFileSync(mdPath);
    const str = con.toString();
    const returnArr = regxImg(str, hrefHost);
    console.log(returnArr);
}