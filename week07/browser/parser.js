//引入 css
const css = require('css');

const EOF = Symbol("EOF"); //end of file

//layout文件
const layout = require("./layout.js");

let currentToken = null;
let currentAttribute = null;


//创建一个栈
let stack  = [{type:"document", children:[]}];
//文本节点
let currentTextNode = null;


//加入一个新的函数，addCSSRules,这里我们把CSS规则暂存到数组里面
let rules = [] ;
function addCSSRules(text){
    var ast = css.parse(text);
   // console.log(JSON.stringify(ast, null, "   "));
    rules.push(...ast.stylesheet.rules);
    //用了比较性的特性，就是把数组展开当参数传进去
}

//加入match函数，在选择器拆分这一环节，看元素和选择器是否匹配（从内向外）
function match(element,selector){
    if(!selector || !element.attributes)
        return false;
    

        // attributes不是用kv存储的，它是使用数组存储的
        // 所以我们要把他过滤出来，使用filter，
    if(selector.charAt(0)  == "#"){
        var attr = element.attributes.filter(attr => attr.name === "id" )[0];
        if(attr && attr.value === selector.replace("#", ''))
            return true;
    }else if(selector.charAt(0) == '.'){
        var attr = element.attributes.filter(attr => attr.name === 'class')[0];
        if(attr && attr.value === selector.replace('.',''))
            return true;
    }else {
        if(element.tagName  === selector){
            return true;
        }
    }
    return false;
}

//四元组
function specificity(selector){
    var p = [0,0,0,0];
    var selectorParts = selector.split(" ");
    for(var part of selectorParts){
        if(part.charAt(0) == "#"){
            p[1] += 1;
        } else if(part.charAt[0] == "."){
            p[2] += 1;
        } else {
            p[3] += 1;
        }
    }
    return p;
}

//如果属性发生冲突的话，就compare
function compare(sp1,sp2){
    if(sp1[0] - sp2[0])
        return sp1[0] - sp2[0];
    if(sp1[1] - sp2[1])
        return sp1[1] - sp2[1];
    if(sp1[2] - sp2[2])
        return sp1[2] - sp2[2];

    return sp1[3] - sp2[3];

}

//computeCSS
function computeCSS(element){
    // console.log(rules);
    // console.log("compute CSS for Element",element);
    var elements = stack.slice().reverse();
    if(!element.computedStyle)
        element.computedStyle = {};
        //给元素添加computedStyle属性

    for(let rule of rules){
        var selectorParts = rule.selectors[0].split(" ").reverse();

        if(!match(element,selectorParts[0]))//如果当前元素不匹配就退出
            continue;
        
        let matched = false;

        var j = 1;
        for( var i=0; i < elements.length; i++){
            if(match(elements[i], selectorParts[j])) {
                j++;  
            }
        }
        //元素和选择器都可以匹配上
            if(j >= selectorParts.length)
                matched = true;
            
            if(matched){
                var sp = specificity(rule.selectors[0]);
                //如果匹配到，我们要加入，把属性加入到element，也就是生成computedCSS
                var computedStyle = element.computedStyle;
                for(var declaration of rule.declarations) {
                    if(!computedStyle[declaration.property])
                        computedStyle[declaration.property] = {};
                        //算式左部不需要 .value也可以，可以直接存储进computedStyle,
                        //但是在后面我们要涉及到优先级的问题,所以把它存进对象的属性里
                    

                    if(!computedStyle[declaration.property].specificity){
                        computedStyle[declaration.property].value = declaration.value;
                        computedStyle[declaration.property].specificity = sp;
                    }else if(compare(computedStyle[declaration.property].specificity, sp)<0){
                        computedStyle[declaration.property].value = declaration.value;
                        computedStyle[declaration.property].specificity = sp;
                    }
                    
                    }  
                    // console.log(element.computedStyle); 
            }
        }
     }

function emit(token){
    // if(token.type ==="text")
    //   return ;
    let top  = stack[stack.length - 1];

    if(token.type == "startTag"){
        let element = {
            type: "element",
            children :[],
            attributes: []
        };

        element.tagName = token.tagName;

        for(let p in token){
            if(p != "type"  && p !== "tagName")
                element.attributes.push({
                    name: p,
                    value: token[p]
                });
            }
            //在元素被创建，并且tagName和属性已经设置了的时候才进行computeCSS

            computeCSS(element);
            // layout(element);


            top.children.push(element);
            element.parent = top;//传入父元素

            if(!token.isSelfClosing)
              stack.push(element);

            currentTextNode = null;
        } else if(token.type =="endTag"){
            if(top.tagName != token.tagName){
                throw new Error("Tag start end doesn't match!");
            }else {
                //++++++++++++遇到style标签时,执行添加CSS规则的操作+++++//
                if(top.tagName === "style"){
                    addCSSRules(top.children[0].content);
                }
                //在endTag的位置添加layout,因为要取到它的子元素才可以进行layout
                // 我们用了简便的方法，实际浏览器是根据属性来判断它是处于哪个阶段的
                layout(top);
                stack.pop();
            }
            
            currentTextNode = null;
        }else if(token.type == "text"){
            if(currentTextNode == null){
                currentTextNode = {
                    type:"text",
                    content:""
                }
                top.children.push(currentTextNode);
            }
            currentTextNode.content += token.content;
        }
    }


function data(c){
    if(c == "<") {
        return tagOpen;
    }else if(c == EOF){
        emit({
            type:"EOF"
        });
        return ;
    }else {
        emit({
            type:"text",
            content:c
        });
        return data;
    }
}

function tagOpen(c){
    if(c == "/"){
        return endTagOpen;
    }else if(c.match(/^[a-zA_Z]$/)){
        currentToken = {
            type: "startTag",
            tagName: ""
        }
        return tagName(c);
    }else {
        emit({
            type:"text",
            content:c
        });
        return ;
    }
}


function tagName(c){
    if(c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    }else if(c == "/"){
        return selfClosingStartTag;
    }else if(c.match(/^[A-Z]$/)){
        currentToken.tagName += c //.toLowerCase()
        return tagName;
    }else if(c == ">"){
        emit(currentToken);
        return data;
    }else {
        currentToken.tagName += c;
        return tagName;
    }
}

function beforeAttributeName(c){
    if(c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    }else if(c == ">" || c == "/" || c == EOF){
        return afterAttributeName(c);
    }else if(c == "="){
        
    }else {
        currentAttribute = {
            name:"",
            value:""
        }
        //console.log("currentAttribute",currentAttribute);
        return attributeName(c);
    }
}

function attributeName(c){
    //console.log(currentAttribute);
    if(c.match(/^[\t\n\f ]$/) || c == "/" || c == ">" || c == "EOF") {
        return afterAttributeName(c);
    }else if(c == "="){
        return beforeAttributeValue;
    }else if(c == "\u0000"){

    }else if(c == "\"" ||  c == "'" || c == "<" ){

    }else {
        currentAttribute.name += c;
        return attributeName;
    }
}


function beforeAttributeValue(c){
    if(c.match(/^[\t\n\f ]$/) || c == "/" || c == ">" || c == EOF){
        return beforeAttributeValue;
    }else if(c == "\""){
        return doubleQuotedAttributeValue;
    }else if(c == "\'"){
        return singleQuotedAttributeValue;
    }else if(c == ">"){
        //return data
    }else{
        return UnquotedAttributeValue(c);
    }
}

function doubleQuotedAttributeValue(c){
    if(c == "\""){
         currentToken [currentAttribute.name] = currentAttribute.value;
         return afterQuotedAttributeValue;
    }else if(c == "\u0000"){

    }else if(c == EOF){

    }else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}

function singleQuotedAttributeValue(c){
    if(c == "\'"){
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    }else if(c == "\u0000"){

    }else if(c == EOF){
        
    }else {
        currentAttribute.value += c;
        return singleQuotedAttributeValue
    }
}
function afterQuotedAttributeValue(c){
    if(c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    }else if(c == "/"){
        return selfClosingStartTag;
    }else if(c == ">"){
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    }else if(c == EOF){

    }else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue
    }
}

function UnquotedAttributeValue(c){
    if(c.match(/^[\t\n\f ]$/)){
        currentToken[currentAttribute.name] = currentAttribute.value;
        return beforeAttributeName;
    }else if(c == "/"){
        currentToken[currentAttribute.name] = currentAttribute.value;
        return selfClosingStartTag;
    }else if(c == ">"){
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    }else if(c == "\u0000"){

    }else if(c == "\""|| c == "'" || c =="<"  || c =="=" || c == "`"){

    }else if(c == EOF){

    }else {
        currentAttribute.value += c;
        return UnquotedAttributeValue;
    }
}

function selfClosingStartTag(c){
    if(c == ">"){
        currentToken.isSelfClosing = true;
        emit(currentToken);
        return data;
    }else if(c == "EOF"){

    }else{

    }
}

function endTagOpen(c){
    if(c.match(/^[a-zA-Z]$/)){
        currentToken = {
            type: "endTag",
            tagName: ""
        }
        return tagName(c);
    }else if(c == ">"){

    }else if(c == EOF){

    }else{

    }
}
function  afterAttributeName(c){
    if(c.match(/^[\t\n\f ]$/)){
        return afterAttributeName;
    }else if(c == "/"){
        return selfClosingStartTag;
    }else if(c == "="){
        return beforeAttributeValue;
    }else if(c == ">"){
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    }else if(c == EOF){

    }else {
        currentToken[currentAttribute.name] = currentAttribute.value;
        currentAttribute = {
            name: "",
            value:""
        };
        return attributeName(c);
    }
}

module.exports.parseHTML = function parseHTML(html){
   let state = data; //初始状态是 data
   for(let c of html) {
       state = state(c);
   }
   state = state(EOF);
   //
   return stack[0];
}