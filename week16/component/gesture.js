
export function enableGesture(element){
    let contexts = Object.create(null);

    let MOUSE_SYMBOL = Symbol('mouse');

    // 鼠标和触摸板只启用一个 
    if(document.ontouchstart !== null)
        element.addEventListener('mousedown', (event) =>{
            contexts[MOUSE_SYMBOL] = Object.create(null);

            start(event, contexts[MOUSE_SYMBOL]);

            let mousemove = event => {
            move(event, contexts[MOUSE_SYMBOL]);
            }

            let mouseend = event => {
                end(event, contexts[MOUSE_SYMBOL]);
                document.removeEventListener('mousemove',mousemove);
                document.removeEventListener('mouseup',mouseend);
            }
            document.addEventListener('mousemove',mousemove);
            document.addEventListener('mouseup',mouseend);
        })

    element.addEventListener('touchstart', event => {
        for(let touch of event.changedTouches){
            contexts[touch.identifier] = Object.create(null);
            start(touch, contexts[touch.identifier] );
        }
    })

    element.addEventListener('touchmove', event => {
        for(let touch of event.changedTouches){
            move(touch, contexts[touch.identifier]);
        }
    })

    element.addEventListener('touchend', event => {
        for(let touch of event.changedTouches){
            end(touch, contexts[touch.identifier]);
            delete contexts[touch.identifier];
        }
    })

    element.addEventListener('touchcancel', event => {
        for(let touch of event.changedTouches){
            cancel(touch, contexts[touch.identifier]);
            delete contexts[touch.identifier];
        }
    })

    let start = (point,context) => {
        element.dispatchEvent(new CustomEvent('start', {
            startX:point.clientX,
            startY:point.clientY,
            clientX:point.clientX,
            clientY:point.clientY
        }));
        context.startX = point.clientX, context.startY = point.clientY;
        context.moves = [];
        context.isTap = true;
        context.isPan = false;
        context.isPress = false;

        context.timeoutHandler = setTimeout(() => {
            // pan的优先级比press高 如果已经是 pan的话 那么就会不会执行下面的代码了
            if(context.isPan)
                return;
            
            context.isTap = false;
            context.isPan = false;
            context.isPress = true;
            element.dispatchEvent(new CustomEvent('pressstart', {}));
        },500);
        
    }

    let move = (point,context) => {
        let dx = point.clientX - context.startX, dy = point.clientY - context.startY;

        // !context.isPan 是因为panstart不可以重复触发
        if(dx ** 2 + dy ** 2 > 100 && !context.isPan){
            // 如果按下超过0.5s之后再移动
            if(context.isPress){
                element.dispatchEvent(new CustomEvent('presscancel', {}));
            }
                
            context.isTap = false;
            context.isPan = true;
            context.isPress = false;
            
            element.dispatchEvent(new CustomEvent('panstart', {
                startX:context.startX,
                startY:context.startY,
                clientX:point.clientX,
                clientY:point.clientY
            }));
        }

        // 如果已经移动了 那么再次移回去也不会取消
        if(context.isPan){
            context.moves.push({
                dx,
                dy,
                t: Date.now()
            });
            // 只留下300ms的，太远的不计算
            context.moves = context.moves.filter(record => Date.now() - record.t < 300);
            let e = new CustomEvent('pan', );
            
            Object.assign(e, {
                startX:context.startX,
                startY:context.startY,
                clientX:point.clientX,
                clientY:point.clientY
            })

            element.dispatchEvent(e);
        }

        // console.log('move', dx, dy);
    }

    let end = (point,context) => {
        if(context.isPan){
            let dx = point.clientX - context.startX, dy = point.clientY - context.startY;
            let record = context.moves[0];
            let speed = Math.sqrt((record.dx - dx) ** 2 + (record.dy - dy) ** 2) / (Date.now() -  record.t);
            // console.log(speed);
            let isFlick = speed > 1.5;

            if(isFlick){
                element.dispatchEvent(new CustomEvent('flick', {
                    startX:context.startX,
                    startY:context.startY,
                    clientX:point.clientX,
                    clientY:point.clientY,
                    speed:speed
                }));
            }

            // console.log(context.moves);
            // object.assign  第一个参数就是原来的对象  把第二个参数定义的属性copy到第一个参数所提及的对象上
            element.dispatchEvent(Object.assign(new CustomEvent('panend'), {
                startX:context.startX,
                startY:context.startY,
                clientX:point.clientX,
                clientY:point.clientY,
                speed:speed,
                isFlick:isFlick
            }));
        }   

        // 用户事件 CustomEvent
        if(context.isTap){
            element.dispatchEvent(new CustomEvent('tap', {}));
        }
        if(context.isPress){
            element.dispatchEvent(new CustomEvent('preessend', {}));
        }
            
        clearTimeout(context.timeoutHandler);
        
    }

    let cancel = (point,context) => {
        element.dispatchEvent(new CustomEvent('cancelled', {}));

        clearTimeout(context.timeoutHandler);
    }
}

