import {create, Text, Wrapper} from "./create";
import {Animation, Timeline} from "./animation";
import {ease} from "./cubicBezier";
import {enableGesture} from './gesture';

export class Carousel{
    constructor(config){
        
        this.children = [];
        this.attributes = new Map();
        this.properties = new Map();
    }
    

    setAttribute(name, value){//attribute
        this[name] = value;
    }

    appendChild(child){//children
       
        this.children.push(child);
     }

    //  set title(value){
    //      this.properties.set("title", value);
    //  }

     render(){

        let timeline = new Timeline;
        timeline.start();

        let position = 0;
         
        let nextPicStopHandler = null;

          
        let children = this.data.map((url,currentPosition) =>{
        
            let lastPosition = (currentPosition - 1 + this.data.length) % this.data.length;
            let nextPosition = (currentPosition + 1) % this.data.length;
        
            let offset = 0;

            let onStart = () => {
                timeline.pause();
                clearTimeout(nextPicStopHandler);

                let currentElement = children[currentPosition];

                let currentTransformValue = Number(currentElement.style.transform.match(/translateX\(([\s\S]+)px\)/)[1]);
                offset = currentTransformValue + 500 * currentPosition;
            }

                
            let onPan = event => {
                 
                let lastElement =  children[lastPosition];
                let currentElement =  children[currentPosition];
                let nextElement =  children[nextPosition];

                let dx = event.clientX - event.startX;

                let lastTransformValue = -500 - 500 * lastPosition + offset + dx;
                let currentTransformValue = -500 * currentPosition + offset + dx;
                let nextTransformValue = 500 - 500 * nextPosition + offset + dx;

                
                // console.log(currentTransformValue + dx);

                lastElement.style.transform = `translateX(${lastTransformValue}px)`;
                currentElement.style.transform = `translateX(${currentTransformValue}px)`;
                nextElement.style.transform = `translateX(${nextTransformValue}px)`;

            }

            let onPanend = event => {
                let direction = 0;
                let dx = event.clientX - event.startX;

                if(dx + offset > 250){
                    direction = 1;
                }else if(dx + offset < -250){
                    direction = -1;
                }
                timeline.reset();
                timeline.start();

                  
                let lastElement =  children[lastPosition];
                let currentElement =  children[currentPosition];
                let nextElement =  children[nextPosition];

              
                let lastAnimation = new Animation(lastElement.style, "transform",  -500 - 500 * lastPosition + offset + dx, 
                    -500 - 500 * lastPosition + direction * 500, 500, 0, ease, v =>`translateX(${v}px)`);
                let currentAnimation = new Animation(currentElement.style, "transform", -500 * currentPosition + offset + dx, 
                    -500 * currentPosition + direction * 500, 500, 0, ease, v =>`translateX(${v}px)`);
                let nextAnimation = new Animation(nextElement.style, "transform", 500 - 500 * nextPosition + offset + dx, 
                    500 - 500 * nextPosition +  direction * 500, 500, 0, ease, v =>`translateX(${v}px)`);

                timeline.add(lastAnimation);
                timeline.add(currentAnimation);
                timeline.add(nextAnimation);

                position = (position - direction + this.data.length) % this.data.length;

                nextPicStopHandler = setTimeout(nextPic,3000);
                
            }

            let element = <img src = {url} onStart = {onStart} onPan = {onPan}  onPanend = {onPanend} enableGesture={true}/>;
            element.style.transform = "translateX(0px)";
            element.addEventListener('dragstart', event => event.preventDefault());
            return element;
        })


        let nextPic =  () => {
            //纯粹的视觉表现上的东西,不可以使用DOM操作，不可以使用append,
            //会改变语义改变结构，只能修改CSS

            let nextPosition = (position + 1) % this.data.length;

            let current = children[position];
            let next = children[nextPosition];

            let currentAnimation = new Animation(current.style, "transform", -100 * position, 
            -100 -100 * position, 500, 0, ease, v=>`translateX(${5 * v}px)`);
            let nextAnimation = new Animation(next.style, "transform", 100 -100 * nextPosition, 
            -100 * nextPosition, 500, 0, ease, v=>`translateX(${5 * v}px)`);

            timeline.add(currentAnimation);
            timeline.add(nextAnimation);

            position = nextPosition;
            // window.xstopHandler = setTimeout(nextPic,3000);
/*
            //使用requestAnimationFrame需要套两层
            setTimeout(function(){
                current.style.transition = '';//mean use css rule
                next.style.transition = '';

                current.style.transform =`translateX(${-100 -100 * position}%)`;
                next.style.transform =`translateX(${-100 * nextPosition}%)`;

                position = nextPosition;
            }, 16);
            //16ms正好是一帧,1000/60
        */
            nextPicStopHandler = setTimeout(nextPic,3000);
        }
        nextPicStopHandler = setTimeout(nextPic,3000);

         return <div class = 'carousel'>
            {children}
        </div>
     }
 
     mountTo(parent){
        this.render().mountTo(parent);
     }
}
