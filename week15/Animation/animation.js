export class Timeline{
    constructor(){
        this.animations = [];
        this.requestID = null;
        this.state = "inited";

        this.tick = () =>{
             // console.log('tick');
        let t =  Date.now() - this.addTime ;
        console.log(t);
        let animations = this.animations.filter(animation => !animation.finished);

        for(let animation of this.animations){
        
            let {object, property, template, start, end, duration, timingFunction, delay, addTime} = animation;

            let progression = timingFunction((t - delay - addTime) / duration); //0- 1之间，代表百分比

            if(t > duration + delay + addTime) {
                progression = 1;
                animation.finished = true;
            }
                

            let value = animation.valueFromProgression(progression); //value就是根据Progression算出的当前值

            object[property] = template(value);
        }

        if(animations.length)
            this.requestID = requestAnimationFrame(this.tick);
        }
    }

    pause(){
        if(this.state !== 'playing')
            return ;
        this.state = 'paused';
        this.pauseTime = Date.now();
        if(this.requestID !== null)
            cancelAnimationFrame(this.requestID);     
    }

    resume(){
        if(this.state !== 'paused')
            return ;
        this.state = 'playing';
        this.addTime += Date.now() - this.pauseTime;
        this.tick();
    }

    start(){
        if(this.state !== 'inited')
            return ;
        this.state = 'playing';
        this.addTime = Date.now();
        this.tick();
    }

    restart(){
        if(this.state === 'playing')
            this.pause();
        this.animations = [];
        this.requestID = null;
        this.state = "playing";
        this.addTime = Date.now();
        this.pauseTime = null;
        this.tick();
    }

    add(animation, addTime){
        this.animations.push(animation);
        animation.finished = false;
        if(this.state === "playing"){
            animation.addTime = addTime || Date.now() - this.addTime;  
        } else {
            animation.addTime = addTime || 0;
        }
       
    }
}

export class Animation {
    constructor(object, property, start, end, duration, delay, timingFunction, template) {
        this.object = object;
        this.property = property;
        this.template = template ;
        this.start = start;
        this.end = end;
        this.duration = duration;
        this.delay = delay;
        this.timingFunction = timingFunction;
    }
    valueFromProgression(progression) {
        return this.start + progression * (this.end - this.start);
    }
}


export class ColorAnimation {
    constructor(object, property, start, end, duration, delay, timingFunction, template) {
        this.object = object;
        this.property = property;
        this.template = template || (v => `rgba(${v.r}, ${v.g}, ${v.b},${v.a})`);
        this.start = start;
        this.end = end;
        this.duration = duration;
        this.delay = delay;
        this.timingFunction = timingFunction;
    }

valueFromProgression(progression) {
    return {
        r: this.start.r + progression * (this.end.r - this.start.r),
        g: this.start.g + progression * (this.end.g - this.start.g),
        b: this.start.b + progression * (this.end.b - this.start.b),
        a: this.start.a + progression * (this.end.a - this.start.a)
    }
   }
}


// let animation = new Animation(object, property, start, end, duration, delay, timingFunction);
// let animation2 = new Animation(object2, property2, start, end, duration, delay, timingFunction);

// let timeline = new Timeline;

// timeline.add(animation);
// timeline.add(animation2);

// timeline.start()
// timeline.pause()
// timeline.resume()
// timeline.stop()

// setTimeout
// setInterval
// requestAnimationFrame

