import {enableGesture} from './gesture';

//框架代码
export function create(Cls, attributes, ...children){
    // console.log(arguments);

    let o;
    if(typeof Cls === 'string'){
        o = new Wrapper(Cls);
    }else {
        o = new Cls({
            timer:{}
        })
    }


    for(let name in attributes){
        //使用component.class 修改的时候，会调用两次set，我们可以再设置一个setAttribute
        // o[name] = attributes[name];
        o.setAttribute(name, attributes[name]);
    }

    // console.log(children);
    let visit = (children) =>{
        for(let child of children){
            if(typeof child === 'object' && child instanceof Array){
                visit(child);
                continue;
            }
            if(typeof child === 'string'){
                child = new Text(child);
            }
            o.appendChild(child);
        }   
   }
   visit(children);
      
    return o;
}


//处理文字
export class Text{
    constructor(text){
        // console.log("config", config);
        this.children = [];
        this.root = document.createTextNode(text);
    }

    mountTo(parent){
        parent.appendChild(this.root); 
     }
}

//处理首字母为小写的情况(div)
export class Wrapper{
    constructor(type){
        // console.log("config", config);
        this.children = [];
        this.root = document.createElement(type);
    }

    setAttribute(name, value){//attribute
        this.root.setAttribute(name, value);

        if(name.match(/^on([\s\S]+)$/)){
            let eventName = RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase());
            this.addEventListener(eventName, value);
        }

        if(name === 'enableGesture'){
            enableGesture(this.root);
        }
    }

    appendChild(child){//children
        // child.mountTo(this.root);
        this.children.push(child);
     }

     addEventListener(){
         this.root.addEventListener(...arguments);
     }

     get style(){
         return this.root.style;
     }
 
     mountTo(parent){
        parent.appendChild(this.root);

        for(let child of this.children)
            child.mountTo(this.root);
     }
}