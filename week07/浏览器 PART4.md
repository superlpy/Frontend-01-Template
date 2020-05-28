# 浏览器 PART4 

#####  1. 排版

+ 第一类： display： block inline inline-block   position: relative absolute  float clear
+ 第二类 ： flex 我们使用这个就已经可以满足我们的需求了，他在这三类里面使用起来是最简单的了
+ 第三类： grid，CSShodini貌似加入了第四代的排版布局

**2.Main Cross**

+ flex-direction   row/column

+ layout需要加在parser里面**结束标签**的位置，因为我们必须要拿到它的**子元素**才可以进行layout,（简化处理）但是在**实际**的浏览器运行过程中，我们是要根据属性来判断处在哪一个阶段。比如是正常流中，我们不需要等到endtag，在startTag就可以开始layout了。

+ 不是flex的元素，我们就当做他不存在，这是一种极端简化的方法

+ 如果元素的type 不是element 我们就把它过滤掉，这样的话文本节点都处理掉

+ order对元素排序

+ 没有指定size或者设置为auto,我们可以把size设置为null

+ style的设置值，给定一些默认值 

  + flexDirection row
  + alignItems stretch
  + justifyContent flex-start
  + flexWrap nowrap
  + alignContent stretch

+ 十个变量

  | 变量      | 含义                 |
  | --------- | -------------------- |
  | mainSize  | width/height         |
  | mainStart | left right           |
  | mainEnd   | left right           |
  | mainBase  | 排版的起点，0  width |
  | mainSign  | 排布方向 正或负      |

  cross同上

+ wrap-reverse 会影响交叉轴，如果他存在我们需要把交叉轴的 start 和 end 交换一下

  ```javascript
  if(style.flexWrap === "wrap-reverse") {
      var tmp = crossStart;
      crossStart = crossEnd;
      crossEnd = tmp;
      crossSign = -1;
  } else {
      crossBase = 0;
      crossSign = 1;
  }
  ```

  > Q1: sign就是**符号**，正或者负。写成+1，就是为了让他和-1有一个比较明确的对应关系，**正负号做成了变量**推荐使用这种写法。可以直接参与**数学运算**
  >
  > Q2: base表示开始的位置
  >
  > Q3: (1)nowrap 就不分行
  >
  > （2）wrap:从上向下，从左往右
  >
  > （3） wrap-reverse  : 从下往上，从左往右
  >
  > Q4: 手机端只用flex就可以

**3.把元素收进行里**

+ 分行  mainSize有关 主轴尺寸进行分行，设置nowrap元素就会强行分进第一行

+ 处理特例：

  f父元素没有设置mainSize就会被自动撑开，子元素之和就是主轴长度

+ flexLIne表示行，mainSpace剩余空间，crossSpace,

+ 元素有flex属性就证明他是可以伸缩的，不管有多少元素都可以放进去。父元素设置为 nowrap 硬塞到一行里面。本身的item比主轴还要宽，至少把它缩放到和主轴一样宽。如果mainSpace小于item的宽度，我们就要开辟新行。

+ max函数找一行中最高的

> Q1:  参考代码： wintercn/sprite-core/tree/master/...

**3. 计算主轴**

+ flex元素是可以填满剩下的宽度的，但是它的宽度是个问号？

  如果有多个flex元素，我们就可以把主轴方向的剩余尺寸按比例分配给这些元素///如果剩余空间为负，所有flex元素为0，等比压缩剩余元素

+ 单行情况下会发生 overflow的问题，宽度为负，算scale值

+ 前一个元素的mainEnd是后一个元素的mainStart

  ```javascript
  itemStyle[mainStart] = currentMain;
  itemStyle[mainEnd] = itemStyle[mainStart] + mainSign  * itemStyle[mainSize]
  currentMain = itemStyle[end];
  ```

+ 多行元素的情况下

  flexTotal>0 ,代表有flex元素的存在

  没有flex元素，mianSpace还是存在的，justifyContent就会开始工作

  > step 元素间距  
  >
  > **justifyContent** 可能取值：
  >
  > 1.  flex-start
  >
  > 2. flex-end
  >
  > 3. center
  >
  > 4. space-between 要计算step
  > 5. space-around
  >
  > 如果有flexItem,justifyContent是不会发生作用的

  > Q1: 内容超过100%，flex元素就会消失
  >
  > flex是三个属性的快捷方式，不是单独的属性
  >
  > Q2: 记住模型而不是属性，

  

  **4.计算交叉轴**

  + 行高flexAlign itemAlign 确定元素具体位置

  + 主要是align-items 和 align-self

  + align-content  和 justifyContent 类似 

  + 每一行尺寸，lineCrossSize  

  + alignSelf  alignItems,  alignContent是整体的，

  + alignItems是最小单位的align,alignSelf是可以逐个元素取的（他们两个的区别就在于一个是批量，一个是单个）

    

