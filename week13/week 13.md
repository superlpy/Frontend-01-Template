# week13 

### PART1

![image-20200716224301113](C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200716224301113.png)

1. reactive （类似observable）
2. proxy的创建一般就是 return 一个 proxy的对象（类似promise）
3. 把object包装成为一个proxy事件,和object相比proxy提供了各种各样的Hook属性
4. 多个effect可同时监听多个函数
5. get set 必须是固定对象的固定属性名，proxy什么都可以收集
6. **依赖收集**是看有哪些方法在调用计算的时候使用了这个变量，等这个变量值更新的时候再调一次依赖这个变量的方法去做重新计算
7. +  先将数据换成**响应式**，即数据有 get、set
   +  **首次**执行函数，执行函数时会触发数据的 get，此时要**保存**正在执行的函数，建立执行的函数和触发的数据间的关系
   +  数据重新赋值时触发 set，重新执行函数
8.  调用effect进行依赖收集，调用set时候针对收集到的依赖，从Map中取出来要执行那些函数

----

### PART2  组件化

1. 

<img src="C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200717235450608.png" alt="image-20200717235450608" style="zoom:67%;" />

> config： 组件构造的时候就决定的一些设置
>
> 组件树: 有children级别，虽然不是每个组件都要有children,但是体系里面一定要有children的存在

2. <img src="C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200717235749306.png" alt="image-20200717235749306" style="zoom:67%;" />

> State: 只会受到 End User  Input的影响
>
> Children: Component 内部的东西
>
> 其余都可看作是   组件的使用者 和 组建的创作者 交互方式，外部函数一样的东西
>
> 一般来说attribute 只是字符串，有一些不是语言： JSx 允许非字符
>
> React里面 Property Attribute互通
>
> Method  Property 任何一个对象都会有的东西
>
> 组件一般使用对象来进行抽象
>
> Vue:composition API    <=>  React:Hooks
>
> Component一般来说是通过事件把它内部的东西传出去。

3. Attribute

   | Attribute                       | Property                                |
   | ------------------------------- | --------------------------------------- |
   | 强调描述性                      | 强调从属关系<br />1.get set<br />2.data |
   | 在标记语言/ JS 里面都可以被修改 | 只能在JS里面 (使用.)                    |

   在很多情况下，HTML和JS中的 property 和 attribute 含义是完全相等的(id)

   但是也有例外

   （1）class 

   | HTML           | JS                                                           |
   | -------------- | ------------------------------------------------------------ |
   | class = "cls1" | className or classList<br />JS中的 (class)  vs (className ）:<br />     之前是class ,因为class是一个关键字，早期版本JS不允许关键字做属性名所以才有了className,但是现在比较高级的浏览器也都支持class |

   （2）style

   | HTML                   | JS                         |
   | ---------------------- | -------------------------- |
   | style = ‘color:blue’； | style是一个对象，div.style |

   (3) href

   | HTML | JS                                                           |
| ---- | ------------------------------------------------------------ |
   |      | <img src="C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200718104916744.png" alt="image-20200718104916744" style="zoom:50%;" /> |
   
   resolve 过之后，会把相对路径变成绝对路径。
   
   （4）value
   
   <img src="C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200718105146567.png" alt="image-20200718105146567" style="zoom:67%;" />
   
   attribute有点像property的默认值。、
   
   4. 设计组件状态
   
   ![image-20200718105716346](C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200718105716346.png)

5. 大部分组件的创建会使用声明式语言（标签）去创建，没机会去修改new里面的东西

6. lifeCycle

   <img src="C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200718112943571.png" alt="image-20200718112943571" style="zoom:67%;" />

> 组件的生命周期，从开始到销毁
>
> 中间经历的过程包括：
>
> 1. mount 组件的子组件在mount之前都没有CssOm的view部分（因为他没有位置）
> 2.  mount unmount可重复执行多次
> 3.  JS改变 attribute/property，组件就会发生变更（React使用Render,React就是不管发生什么变化都重新Render) 
> 4.  用户输入也会触发一些事件（鼠标拖拽、touch)导致状态变化，UI变更，都是生命周期里面的节点。一般都有before after的环节，（destory只有before）

7. React 
   + 支持函数式  
   + 里面没有 config 
   + props等效于config

<img src="C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200718114716085.png" alt="image-20200718114716085" style="zoom: 80%;" />

> 1. 基于已存在的框架去封装组件也需要定义生命周期！
>
> 3. 有constructor它的生命周期就相当于 created
>
> 4. React是不分 Property 和 Attribute的
> 5. Vue3在主推新的API形式

8. children

   <img src="C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200718115823429.png" alt="image-20200718115823429" style="zoom:80%;" />

> content: 你在里面放几个img他就是几个 img
>
> Template: <my-list> 里面 li 相当于一个 模板，li相当于在my-list里面传入 data一样的东西,根据data的数量而定
>
> 传入的children和实际展现出来的children是不一样的

9. 轮播图

<img src="C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200718121642160.png" alt="image-20200718121642160" style="zoom:80%;" />

children有两种方法 ：Carousel（只轮播里面的img) CarouselView(把里面各个View轮播一遍)

10. > 一个组件系统它里面的每个组件生命周期都是一样的，不需要为每个组件单独的设置生命周期
    >
    > 任何组件都是需要生命周期的，他需要有一个时机去执行
    >
    > attribute可读可写，可让他写无效
    >
    > property 可让他get set 不全

11. Reactivity 可以代替 Redux VUEx RSJS

12. Reactiv完全是 Mutable风格， Reudx是immutable风格

13. React是单独的UI的library,MVC他只是V,它

14. React只负责把数据渲染成界面

15. Redux单向数据流，需要语言特性的支持

16. MVC 

    ​    Model View Controller，是模型(model)－视图(view)－控制器(controller)的缩写

17. MVVM

    ​    是Model-View-ViewModel的简写。它本质上就是MVC 的改进版。MVVM 就是将其中的View 的状态和行为抽象化，让我们将视图 UI 和业务逻辑分开。当然这些事 ViewModel 已经帮我们做了，它可以取出 Model 的数据同时帮忙处理 View 中由于需要展示内容而涉及的业务逻辑

    ​     MVVM（Model-View-ViewModel）框架的由来便是MVP（Model-View-Presenter）[模式](https://baike.baidu.com/item/模式/700029)与WPF结合的应用方式时发展演变过来的一种新型架构[框架](https://baike.baidu.com/item/框架/1212667)。它立足于原有MVP框架并且把WPF的新特性糅合进去，以应对客户日益复杂的需求变化。

18. WPF（Windows Presentation Foundation）是微软推出的基于Windows 的用户界面框架，属于.NET Framework 3.0的一部分。它提供了统一的编程模型、语言和框架，真正做到了分离[界面设计](https://baike.baidu.com/item/界面设计/2155896)人员与开发人员的工作；同时它提供了全新的多媒体交互用户图形界面。
19. Redux 中间件，中间件一般不是用来形容非常细节的部分的，但是Redux用其作为数据处理的一些步骤
20. 中间件不是库，它是有入有出的东西





