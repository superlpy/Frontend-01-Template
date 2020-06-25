# week11 

### 1. Promise

```javascript

new Promise((resolve, reject) => {
element.addEventListener(eventName, resolve, {once: true})
})
addEventListener 第三个参数 比较重要的就是
1. once
2. capture
3. parsive
```

### 2. generator

1. 它和异步是没有什么关系的，但是他可以执行和中断函数相关的效果

```javascript
 let i = go();
undefined
let t = i.next();
undefined
t
{value: Promise, done: false}
t.then(() => let {t, done} = i.next())
```



2. iterator 就是由generator生成的。iterator有自己的格式，通常和for of 搭配

   ```javascript
   <script>
       function* g(){
       yield 1;
       yield 2;
       yield 3;
   }
   for(v of g()){
       console.log(v);
   }
   </script>
   
   <script>
       async function* g(){
       let i = 0;
       while(true){
           await sleep(1000);
           yield i++;
   }
   }
   for await(let v of g()){
       console.log(v);
   }
   </script>
   
   
   栈是要有函数调用才会溢出
   ```

   

3. 我们可以实现永久性的把 generator 变成 async 的函数。

```javascript
  function* go(){
    while (true){
    green();
    yield sleep(1000);
    yellow()
    yield sleep(500);
    red();
    yield sleep(200);
 }          
}


function run(iterator){
            let {value, done}  = iterator.next();
            if(done)
                return;
            if(value instanceof Promise)
            value.then(() => {
                run(iterator);
            })
        }

        function co(generator){
            return function(){
                return run(generator());
            }
        }

     go = co(go);
```

> Question part:
>
> 1. complation 里面有三个字段 type  value  label(跳出外层循环)比较重要
>
> 2. 我们可以理解为baseline middle text-top text-bottom 都是不变的，top和bottom是随着他们变化的
>
> 3. ![image-20200620163222170](C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200620163222170.png)
>
>    -fetch 是分成两段的，给了我们**流式处理数据**的机会
>
>    -http是可以传送多达几个G的数据的，在接收的时候我们通常是先拿到头，然后再去处理它的body(使用trunked或者其他的)
>
>    -fetch兼容性不是很好
>
> 4. 推荐使用 await 而不是 then
>
> 5. async await 不是说可以完全替代Promise，他只是把Promise换了一个语法，在**运行时**他还是在使用Promise在运转。new Promise情况大部分都是可以封装的
>
> 6. JS单线程，里面没有协程的概念

### 3. 寻路

1. 一维数组 创建一个一万个格子的数组

   **Long long ago** 

   ` var map = new Array(10001).join(0).split('').map(s => Number(s));`

   **Now**

   ` var map = new Array(10000).fill(0);`

2. delete localStorage.map  刷新之后画的图就不存在了

> Q1: 实际项目中用户自定义设计存储在哪里？
>
> 存储在服务端，一般不在客户端存储很多的东西，因为localStorage是一个不太可靠的东西，宁愿存储在cookie
>
> Q2: xmlhttp是一个糟粕，看IETF的http就可以了
>
> Q3: try...catch 无法捕捉到 promise 抛到上层的异常？
>
> ```javascript
> <script>
>     function a() {
>       return new Promise((_, reject) => {
>         setTimeout(reject, 1000);
>       })
> 
>     }
> 
>     function b() {
>       try {
>         a()
>       } catch (error) {
>         console.log('捕获到')
>       }
>     }
> 
>     async function c() {
>       try {
>         await a()
>       } catch (error) {
>         console.log('捕获到')
>       }
>     }
>   </script>
> ```
>
> 因为try catch 执行完毕的时候，Promise可能还没有执行完
>
> Q4: 使用 return ?
>
> ![image-20200621213223318](C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200621213223318.png)
>
> 下一个then里面的东西相当于 你return 的 Promise，它会接着你返回的Promise去执行
>
> Q5:用await 能实现Promise.all的功能吗？
>
> 不可以
>
> Q6: 想问下老师如何确保精确的延时执行?
>
> data.now 去校准
>
> Q7: ![image-20200621213849237](C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200621213849237.png)
>
> 每个语法结构在不同的阶段被使用，是对结构取的函数，只有evaluate是真正执行时候的函数
>
> Q8: performance.now() 更精准，它是用浮点数来达到微秒级别的精确度。React里面的调度，算过期时间用的就是这个API
>
> 但是 performance不是JS里面的API
>
> Q9: e.which是啥意思?
>
> ![image-20200621214830830](C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200621214830830.png)
>
> **更标准的**
>
> ![image-20200621214926137](C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200621214926137.png)
>
> Q10: 加了<!DOCTYPE html>  就有了 排版问题。可使用下面方法解决
>
> ```css
> #container {
>     display: flex;
>     flex-wrap: wrap;
>     width: 701px;
>     line-height: 7px;
> }
> 
> 对于font-size有一些问题，比如有些浏览器font-size设置为10px一下就不显示
> #container{
>     width: 701px;
>     font-size:0;
> }
> ```



3. **寻路 Saturday**

   寻路问题可以理解为递归的问题，但实际不是使用递归去做的。路不会重复走，走过一次就不会再走第二次。

   ##### 搜索问题

   1. DFS 深度优先搜索 适合一条路走到底，不找最佳路径也可使用
   2. **BFS 广度优先搜索** 我们的寻路适合这种情况，一层一层的向外找，可以找到最优路径

   ##### 我们的格子有三种情况

   1. 未被走过，还不知道能不能走到，白色
   2. 走过了，紫色
   3. 已经走过，并且他四周的格子也都走过了，蓝色

![image-20200621221022270](C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200621221022270.png)

##### 代码

1. 我们创建一个队列，把所有的**紫格**放进队列里面，然后逐层展开

2. 数组工作（队列总是从一头进，另一头出，我们可以选择数组的方法组合）

3. | push 从数组的尾巴推进去 | shift 从数组的头部取     |
   | ----------------------- | ------------------------ |
   | pop 从数组尾部取出      | unshift 从数组头部推进去 |

4. 启发函数： 起点和终点之间的关系，优先寻找启发函数推荐的点，只要启发函数算出来的值 **小于** 到终点的距离，那么就一定可以找到最佳路径，带启发函数的搜索叫做 A搜索。 其实A搜索不保证可以找到最佳路径，数学家证明： 保证启发函数返回的值 **小于** 到终点的距离，那么就一定可以找到最佳路径



1. |            | 使用Sorted | 使用二叉堆                                                   |
   | ---------- | ---------- | ------------------------------------------------------------ |
   | 时间复杂度 | O(n)       | O(log n)                                                     |
   | 存储形式   | 数组       | ![image-20200622102849436](C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200622102849436.png)数组，1 2 4 8 这样排列，如果4位置出现空洞就把尾元素pop()出来填补。 |
   
2. ```javascript
   class BinaryHeap{//二叉堆，大堆|小堆
           constructor (data, compare){
               this.data = data;
               this.compare = compare;
           }
   
           take(){
               if(!this.data.length)
                   return ;
               let min = this.data[0];
               let i = 0;
   
               //fix heap 填洞
               while(i < this.data.length){ //洞在i这个位置
                   if(i * 2 + 1 >= this.data.length){
                       //当前节点为i,那么他的子节点就是 i*2+1或者i*2+2,
                       break;
                   }
                   if(i * 2 + 2 >= this.data.length){
                       this.data[i] = this.data[i * 2 + 1];
                       i = i * 2 + 1;
                       break;
                   }
                   //默认按照小堆
                   if(this.compare(this.data[i * 2 + 1], this.data[i * 2 + 2]) < 0){
                       this.data[i] = this.data[i * 2 + 1];
                       i = i * 2 + 1;
                   } else {
                       this.data[i] = this.data[i * 2 + 2];
                       i = i * 2 + 2;
                   }
               }
               //如果上面运行结束之后还有洞，那么就从数组末尾pop()出一个数来填补
               if(i < this.data.length - 1){
                   this.insertAt(i, this.data.pop());
               } else {
                   this.data.pop();
               }
               
               
               return min;
           }
   
           insertAt(i, v){
               
               this.data[i] = v;
               //当前节点为 i ,那么它的父节点下标就是 Math.floor((i-1)/2)
              while(i > 0 && this.compare(v, this.data[Math.floor((i-1)/2)]) < 0){
                   this.data[i] = this.data[Math.floor((i-1)/2)];
                   this.data[Math.floor((i-1)/2)] = v;
                   i = Math.floor((i-1)/2);
               }
           }
           insert(v){
             this.insertAt(this.data.length, v);
           }
           
           get length(){
               return this.data.length;
           }
   
       }
   ```

   > 插入 insert 是从下往上， 但是 填洞 是从上往下



### 正则

1. ![image-20200622195710697](C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200622195710697.png)

2. ```javascript
   "[a=value]".match(/\[([^=]+)=([^\]]+)\]/)
   "[a=value]".match(/\[?:([^=]+)=(?:[^\]]+)\]/)
   
   使用括号将我们需要的部分match出来，并且是严格按照括号的顺序执行的
   如果我们不想让括号匹配，只想让他起到圈组的作用，那么我们就要在(?:)里面取消它的作用
   ```

   ![image-20200622201233139](C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200622201233139.png)

3. **replace**

   ![image-20200622202245275](C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200622202245275.png)

4. exec

   ```javascript
   let lastIndex  = 0;
   let token;
   
   do{
   	token = inputElement.exec(source);
       console.log(token);
   }
   
   while(inputElement.lastIndex  - lastIndex == token.length)
    //查看是否完全匹配
   ```

### 答疑·part

> Q1: Map  VS  Set