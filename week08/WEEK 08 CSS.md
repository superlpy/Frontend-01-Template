first-line是正常流里面的第一行，不可以float

first-letter是源码里面的第一个字，他可以float

源码里面第一个字是固定的。



BFC里面才可发生 margin折叠，inline-box里面是没有边距折叠的，float也没有。边距折叠只能发生在上下方向。

margin折叠发生在BFC内部，BFC 可以解决margin折叠问题

overflow-hidden inline-block 都会产生BFC效果

flex里面肯定不是BFC

flex里面的每个item都是BFC

正常流里面的容器，且设置为 overflow-visible,就不是BFC，会和外面的BFC合并

正常流里面放置正常流，才有可能产生BFC的合并

一个BFC里面就是正常流，





block-box = block-level + block-container

block-box 里外都是block,如果 overflow: visible,就和父元素合并

block-level-box 表示可以被可以放进 BFC

block-container  表示可以容纳BFC





inline-block:可以当两部分看，对外面的它的兄弟节点来说，他是一个inline元素，对它包含的元素来说，他是一个可以包含block的container，建立BFC

display: block 也就是display: block-block



flex inline-flex

table inline-table

grid inline-grid

block inline-block

inline

run-in



block-container:  只有 block 和 inline-block

block-level:  flex table grid block

前两者都是的：只有block

flex父元素 flex-container ，子元素 flex-item(产生BFC)



**flex**（三个属性的合并）

收集盒

计算盒在主轴方向排布

计算盒在交叉轴方向的排布



block-container 里面都是正常流

除了四个伪元素选择器，没有什么可以选中盒子

grid靠属性定义结构，比flex灵活得多

container里面是正常流就是BFC



文本不是盒模型，除非字体行高，我们不是很关心其他方面

文字也可以无限放大



.flex里面的flex-item不是正常流，与外部不会发生边距折叠
.flex本身还是会跟同级元素发生边距折叠
.flex本身不是正常流
.flex内部的flex-item本身不是正常流
.正常流和正常流才会发生合并，所以flex本身不会跟内部元素发生边距折叠
.flex-item包含的元素是正常流
.所以flex-item包含的元素之间会发生边距折叠



这是我遇到过的，暂时想起来这么多：

 1、垂直居中你能想到几种方法 

2、什么是盒模型 

3、多行文字，最后一行最后显示 ... 

4、单行文字多余显示 ... 

5、flex 这个简称代表哪些属性 

6、什么是 BFC





![specifishity chart](https://specifishity.com/specifishity.png)

![image-20200601175256602](C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200601175256602.png)![image-20200601175256942](C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200601175256942.png)

![image-20200601174437868](C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200601174437868.png)

 

```html
<style>
  * {
    color: red;
  }
  .a {
    color: green;
  }
</style>
<html>
  <body>
    <div class="a">
      <span class="b">i am text</span>
    </div>
  </body>
</html>

//文字是红色，因为span里面的文字值match到了 *
```





> Q1 :老师为什么transform后的属性值在样式里看不到?
>
>    transform并不会改变width，height，top，bottom,之类的属性值，只有在最后绘制的时候才生效，transfrom本质就是矩阵乘法，GPU用的比较多。



### 伪类

<a> 不加href属性就不是超链接，图片里面的area也可使用超链接

如果我们在 startTag阶段就使用computeCSS（），下面哪个实现不了？

![image-20200601183715307](C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200601183715307.png)

>  :nth-last-child()  
>
>  :last-child
>
> :only-child