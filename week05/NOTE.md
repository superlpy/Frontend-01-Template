# 每周总结可以写在这里

##### 1.

![image-20200513184517777](C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200513184517777.png)

> JS Context :
>
>    JS引擎里面包含的最大一块的东西，他里面对应Global Object，上节课的例子里面执行了多个宏任务，但是多个红任务之间共享一个全局对象。定义的变量，访问的内置变量，都是相通的。

1. JS Context里面最重要的 **Realm**

   ​    Realm里面有一套完整的**JS内置对象**（每个Realm都有一套完整的）

2. Realm之间可以互相通信吗？

    C++里面是可以的。JS里面也是可以的，可利用iframe上面的window属性去通信。

3. Global Object

   page 388 ，可以通过Global访问到的对象。 ,Realm里面还有Global访问不到的。还有一些对象跟着Global  Object一起被创建。例如Math对象下面有一堆函数对象。

##### 函数调用

![image-20200513220422434](C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200513220422434.png)

比较新的版本才有

###### Execution Context

![image-20200513220924529](C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200513220924529.png)



1. code evaluation state 

    Ithink （await的时候）和 generator函数比较有用，正常的函数不需要存它

2. Function

   execution context 里面执行的是一个函数。但是有可能是null,比如说一个全局的script代码-不在function里面

3. Script or  Module

   同上

4. generator

   只有由generator触发的才有

   ```js
   function *foo(){
       yield 1;
       yield 2;
       yield 3;
   }
   var  g=foo();//这里的g相当于一个generator
   
   g.next()//调用这个之后，他就会在*foo()里面去执行，在调用next的时候，他需要知道知己是在哪一个generator里面执行的，generator是为generator语句量身打造的，也是专门为yield语句打造的，在*foo()里面执行其他的语句都不需要知道（var g=foo(),g这个generator)
   <{value:1, done: false}
   
   
   ```

   ![image-20200513222124137](C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200513222124137.png)

5. `LexicalEnvironment`

   ![image-20200513222301539](C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200513222301539.png)

之前This是Execution Context 里面单独的一个内容。后来被塞到`LexicalEnvironment`里面。

> this在不同的函数中意义不同
>
> 1，箭头函数  跟变量一起塞进去
>
> 2，普通函数 调用的时候才塞进去

6. `VariableEnvironment`

   ![image-20200513222651189](C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200513222651189.png)

但是现在处理var声明的话又用不到它，它是属于运行时的设施，正常情况下var通过预处理就可以把它变成函数级别的东西

```javascript
{//lexicalEnvironment是在这里创建的
    let y=2;
    eval('var x=1;');
}

with({a:1}){
eval('var x:');//函数级别的x
}
console.log(x);
```



###### 不论是`LexicalEnvironment`还是`variableEnvironment`他们各自又都是由很复杂的项组成的。不像set get这些，你塞给他什么，就是什么，他是一个链表的结构

里面的每一个项叫做Environment Record

![image-20200513223645540](C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200513223645540.png)

> global 

任何一个JS引擎的示例，是JS Context级别的，只有一个，是所有Environment Records的最顶端

> Object

一般是由with产生，（老版本的with就会自动带上 object prototype里面的值）

> declarative

function-Closure （利用了JS里面的closure原理）

![image-20200513224539624](C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200513224539624.png)

表面上function foo()里面只有一句代码，但是其实在外面定义的这个var y=2，的environment record被带到了函数里面，成为函数的**属性**





![image-20200513225036264](C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200513225036264.png)

**如果把foo3()改为箭头函数**

![image-20200513225226839](C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200513225226839.png)



### Realm

![image-20200513231205902](C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200513231205902.png)

```javascript
var a = new Array(); //这两句是不需要使用Realm的，因为他在LexicalEnvironment里面就可以取到这个函数

var o = new Object();//他们两个是全局变量

Lexical Environment

//需要的例子
var a = {};//写一个直接量
//因为他有Prototype


```

```java
Object.getPrototypeOf({})
{constructor: ƒ, __defineGetter__: ƒ, __defineSetter__: ƒ, hasOwnProperty: ƒ, __lookupGetter__: ƒ, …}

Object.getPrototypeOf({}) === Object.prototype
true
    
var iframe = document.createElement("iframe")
undefined
    
document.body.appendChild(iframe)
<iframe>​…​</iframe>​
    
iframe.contentWindow
Window {parent: Window, opener: null, top: Window, length: 0, frames: Window, …}

iframe.contentWindow.Object.prototype
{constructor: ƒ, __defineGetter__: ƒ, __defineSetter__: ƒ, hasOwnProperty: ƒ, __lookupGetter__: ƒ, …}

iframe.contentWindow.document.body.innerHTML = "<script>window.o = {}</script>"
"<script>window.o = {}</script>"
    
iframe.contentWindow.eval("this.o = {}")
{}

iframe.contentWindow.o
{}

iframe.contentWindow.o instanceof Object
false
    
//他在别的函数里面用直接量创建的对象，就不是Object
    
var o=iframe.contentWindow.o
undefined
    
o
{}

Object.getPrototypeOf(o)
{constructor: ƒ, __defineGetter__: ƒ, __defineSetter__: ƒ, hasOwnProperty: ƒ, __lookupGetter__: ƒ, …}

Object.getPrototypeOf(o) === Object.prototype
false
    
    //只有知道自己在哪个Realm里面才可以正确执行
```



