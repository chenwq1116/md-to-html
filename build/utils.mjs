export function regxMdHref(mdStr,hrefHost){
    let returnArr = [];
    const regexp = /\[\S*\]\(\S*\)/g;
    const mdArray = regReturnArr(mdStr,regexp);
    mdArray.forEach(element => {
        let newSubStr = element.replace('(','(' + hrefHost );
        newSubStr = newSubStr.replace(')','.html)');
        const mdHrefJson = {
            subStr: element,
            newSubStr: newSubStr
        }
        returnArr.push(mdHrefJson);
    });
    return returnArr;
}

export function regxImg(mdStr,hrefHost){
    let returnArr = [];
    const regexp = /\!\[\[.*\]\]/g;
    const mdArray = regReturnArr(mdStr,regexp);
    mdArray.forEach(element => {
        let newSubStr = element.replace('![[','![](' + hrefHost );
        newSubStr = newSubStr.replaceAll(' ','%20');
        newSubStr = newSubStr.replace(']]',')');
        const mdHrefJson = {
            subStr: element,
            newSubStr: newSubStr
        }
        returnArr.push(mdHrefJson);
    });
    return returnArr;
}


function regReturnArr(mdStr,regexp){
    let returnArr = [];
    const mdArray = [...mdStr.matchAll(regexp)];
    mdArray.forEach(element => {
        const srcStr = element[0];
        returnArr.push(srcStr);
    });
    return returnArr;
}