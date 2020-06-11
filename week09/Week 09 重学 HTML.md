# Week 09 重学 HTML

#### 1. HTML标签-语义

| 不能在HTML中使用 | 不能在HTML属性中使用 |
| ---------------- | -------------------- |
| <      &lt       | “      &quot         |
| &      &amp      |                      |

###### 怎么使用多个white-space

```
(1)
<pre>
a     b
</pre>
(2)
<div style="white-space:pre-wrap">
a      b
</div>
想让他多个空格有效，又可以让他换行。就用第二种方法，一般不使用pre，在有代码的时候才使用<pre></pre>
```



> 1. pre既可以阻止空格合并，又可以阻止回车合并
>
> 2. DTD完整的描述了HTML，但是是站在SGML的角度,HTML5已经不再承认自己是SGML的子集
>
> 3. HTML5的XHTML写法是严谨的，遵循了XML的规则，是XML的子集，而HTML5的HTML写法不遵循任何语言的规则
>
> 4. DTD VS namespace
>
>    namespace 是所有的xml都有的东西，表明可以使用哪些标签

### 2. 语义

aside 不同于 sidebar ,我们通常说aside是非主体没有用的部分，它和侧边栏不同

cite :引用的文章标题

quote： q 引用的文章内容

### 3. 语法

![image-20200609171124449](C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200609171124449.png)

<img src="C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200609171155601.png" alt="image-20200609171155601" style="zoom:50%;" />

>  DOM树中的节点
>
>  xml 是可以**多个namespace共存**的
>
> html三类： HTML SVG  MATHML
>
> 多一种namespace ，element下面就会多一种子类
>
> SVGAElement 和 HTMLAnchorElement
>
> 1. html里面就是使用： 来加namespace 
>
> 2. dom里面是通过不同的子类区分namespace
>
> 3. css里面就是| 配合上namespace的@rule来区分



<img src="C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200609173402522.png" alt="image-20200609173402522" style="zoom:50%;" />

<img src="C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200609173553673.png" alt="image-20200609173553673" style="zoom:50%;" />

****

#### 重点



**1. 所有的DOM元素默认只有一个父元素，它不能两次被插入到DOM树中**

​    如果你先插入到A位置，后来又插入到B位置，那么在插入到B位置之前，他会首先从A位置上取下来（自动操作），再进行插入操作。即使是两颗互不相关的DOM树也会遵循这个道理。

**2. childNodes 是一个livingCollection**

​    就是说他是会**实时变化**的，你进行的任何操作：remove/append等，都会修改childNodes的值。比如你 var child []= element.childNodes()；这个不是把他存放到了JS数组里面，只要你后续进行了插入删除等操作，childNodes和child的值都是会改变的。就算你事先把他取了出来，他还是会改变的。

---

![image-20200609175445238](C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200609175445238.png)



1. compareDocumentPosition  这两个节点可以不是一个级别，就是比较他们在Document中的先后顺序
2. isEqualNode 节点里面的结构完全一样的话，不用这个就无法检查
3. cloneNode 传入参数true,则会连同子节点做深拷贝。

---

1. appendChild也好，insertbefore也好，都是把元素**挪过去**而不是加上去

2. 获取一个元素所有的兄弟节点（假设这个元素为a)： a.parentNode.children

3. **childNode是livingCollection的例子**

   把a的子节点全部挪到b里面

   ```html
   <div id="a">
       <div>1</div>
       <div>2</div>
       <div>3</div>
       <div>4</div>
   </div>
   
   <div id="b"></div>
   <script>
       var a = document.getElementById('a');
       var b = document.getElementById('b');
   
       while(a.children.length){
           b.appendChild(a.childNodes[0]);
           //b.appendChild(a.children[0]);
       }  
   </script>
   ```

   错误示范

   ```html
   <div id="a">
       <div>1</div>
       <div>2</div>
       <div>3</div>
       <div>4</div>
   </div>
   
   <div id="b"></div>
   <script>
       var a = document.getElementById('a');
       var b = document.getElementById('b');
   
       for(var i = 0;i < a.children.length; i++){
           b.appendChild(a.children[i]);
           //不可以是chirdNode[i];
       }
   </script>
   ```

   

-----------------

**上面的导航类操作其实还对应一个element版本**

+ parentElement

+ children

+ nextElementSibling

+ previousElementSibling

+ firstEleChild

+ lastElementChild

  ![image-20200609184231593](C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200609184231593.png)

> Q1：虚拟DOM上是不允许work的，它只是执行一下
>
> Q2：伪元素是不在DOM树上的，伪元素不是在layout阶段出来的，是在computeCSS阶段出来的。DOM with CSS 其实应该是 BoxTree with CSS
>
> Q3:
>
> 