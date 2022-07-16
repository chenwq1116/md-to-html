import { regxMdHref } from './utils.mjs';
import path from 'path';
import FS from 'fs-extra';

const mdPath = path.resolve(process.cwd(), 'doc/综合前端系统应知应会.md');

const con = FS.readFileSync(mdPath);
const str = con.toString();

const returnArr = regxMdHref(str);

console.log(returnArr);
