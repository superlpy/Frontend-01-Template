var parser = require('./parser');

module.exports  = function(source, map) {

    let tree = parser.parseHTML(source);
    // console.log(tree.children[1].children[0].content);


    let template = null;
    let script = null;

    for(let node of tree.children) {
        if(node.tagName == "template")
        //让其变成唯一children,进行过滤
            template = node.children.filter(e => e.type != "text")[0];
        if(node.tagName == "script")
            script = node.children[0].content;
    }

    let createCode = "";

    // console.log(template);//template对应元素的父元素

    //Vue2.0 只可处理单根的问题，我们引用depth(深度)处理变量名等的东西
    let visit = (node) => {

        if(node.type === 'text') {
            return JSON.stringify(node.content);
        }
        let attrs = {};

        for(let attribute of node.attributes) {
            attrs[attribute.name] = attribute.value;
        }

        let children = node.children.map(node => visit(node));
        return `create("${node.tagName}", ${JSON.stringify(attrs)}, ${children})`
    };
    

    //字符串模板

    let r =  `
import {create, Text, Wrapper} from "./create";
export class Carousel {
    setAttribute(name, value){//attribute
        this[name] = value;
    }
    render(){
      return ${visit(template)}
    } 
    mountTo(parent){
        this.render().mountTo(parent);
     }
}`;

console.log(r);
return r;

}