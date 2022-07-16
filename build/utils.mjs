export function regxMdHref(mdStr){
    let returnArr = [];
    const regexp = /\[\S*\]\(\S*\)/g;
    const mdArray = regxMdHrefFun(mdStr,regexp);
    mdArray.forEach(element => {
        let newSubStr = element.replace('(','(./');
        newSubStr = newSubStr.replace(')','.html)');
        const mdHrefJson = {
            subStr: element,
            newSubStr: newSubStr
        }
        returnArr.push(mdHrefJson);
    });
    return returnArr;
}

export function regxMdHrefFun(mdStr,regexp){
    let returnArr = [];
    const mdArray = [...mdStr.matchAll(regexp)];
    mdArray.forEach(element => {
        const srcStr = element[0];
        returnArr.push(srcStr);
    });
    return returnArr;
}
