import {create, Text, Wrapper} from "./create";
import{Timeline, Animation} from './animation';
import {Carousel} from "./carousel";
import {ease} from './cubicBezier';

//////////////////////////////////////////////////////////
//用户代码
//JSx里面父子树的构建顺序是 先子后父
/*class MyComponent{
    constructor(config){
        // console.log("config", config);
        this.children = [];
        this.attributes = new Map();
        this.properties = new Map();
    }
    
    //都用setAttribute处理
    // set cls(v){//property
    //     console.log("Parent::cls", v)
    // }
    // set id(v){
    //     console.log("Parent::id", v)
    // }

    setAttribute(name, value){//attribute
        this.attributes.set(name, value);
    }

    appendChild(child){//children
        // child.mountTo(this.root);
        this.children.push(child);
     }

     set title(value){
         this.properties.set("title", value);
     }

     render(){
         return <article>

         <h2>{this.properties.get('title')}</h2>
            <header>I'm a header</header>
            {this.slot}
            <footer>I'm a footer</footer>
         </article>
     }
 
     mountTo(parent){
        this.slot = <div></div>;

        for(let child of this.children)
            this.slot.appendChild(child);

        this.render().mountTo(parent);
     }
}
*/





//孩子
// class Child{
//     constructor(config){
//         // console.log("config", config);
//         this.children = [];
//         this.root = document.createElement('div');
//     }

//     setAttribute(name, value){//attribute
//         this.root.setAttribute(name, value);
//     }

//     appendChild(child){//children
//         child.mountTo(this.root);
//      }
 
//      mountTo(parent){
//          parent.appendChild(this.root);
//      }
// }
//小写的话(div)，它就会认为是一个字符串不报错
//大写的话(Cls)就会认为是一个function或者class，必须要先定义
// let component = <div id="a" cls='b' style="width:100px;height:100px;background-color:lightgreen">
//     <div></div>
//     <p></p>
//     <div></div>
//     <div></div>
// </div>




//处理文字
let component = <Carousel data ={[
    "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
    "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
    "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
    "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
]}/>


//div里面的内容可以是text {1} (不会被认为是字符串，直接输出) {new Wrapper('span')} 数组等

// component.title = "I am title 2"; 

component.mountTo(document.body); 




// var component  = createElement(
//     Parent,
//   {
//     id: "a",
//     "class": "b"
//   },
//   createElement(Child,null),
//   createElement(Child,null),
//   createElement(Child,null)
// );



console.log(component);
// component.setAttribute('id','a');
 