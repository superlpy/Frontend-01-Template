# 重学 CSS |CSS 动画

### 1. Animation

+ @keyframes定义

  可以把keyframes（关键帧）理解为类似变量的东西，定义出来的keyframes传进animation属性里，

  帧：显示器是时刻在刷新的，只有一类不刷新：电子纸屏。一秒超过60帧人眼就看不到闪动。游戏：60帧，让人们在操作的时候感觉到实时响应。

  关键帧，其他的帧是由关键帧计算出来的。

+ animation使用

  + -name
  + -duration
  + -timing-function
  + -delay
  + -iteration-count
  + -direction

### 2.Transition

###### Transition 使用(用属性来实现)

+ -property  可精确控制每个属性

+ -duration

+ -timing-function（不用animation的，用transtition的）

  时间: x轴

  要变换的属性的百分比：纵轴

  三次贝塞尔曲线，(cubic-bezier)  一个起始，一个终止，两个控制

  **ease: 自然。一般都用这个。**

  t不是代表时间，他是数学上的几何量

+ -delay

### 3. Q-S

> 动画的话 ，可以用transition就不要用top left 等
>
> CSS比gif（位图定义）强太多了，gif性能很差的,使用小的video都不要使用gif
>
> CSS和JS的动画性能比较，理论来说CSS比较好，但是要看实际的应用情况
>
> CSS没办法实现JS的部分功能，也有的实现起来特别困难，比如让一个球在屏幕旋转，使用CSS就会需要多次bezier拟合，配合animation等。
>
> 动画和3D无关，3D是渲染出来的
>
> AE动画性能比cubic-bezier强得多。其中里面有几种可以用bezier写出来，也有的可以用bezier拟合，只是部分。
>
> Q1:启动GPU模式的关键?
>
> 就是使用一定会触发GPU的属性tansform/transform-3D等
>
> Q2:will-change?
>
> 和启动GPU无关，是conversation(把元素渲染出来的结果拼接到一
> 起)相关的属性,如果元素layout,render相关属性都不变的话，这个层不需要拆开。节省渲染开销。will-change属性就是提示浏览器我将怎么做一个conversation的策略，每层的拼接都是非常讲究的事情。
>
> Q3:现在CSS动画兼容性非常好。
>
> Q4:正常的渲染(最后像素的渲染都是需要用到GPU的，不是说用不用
> GPU,只是涉及到用多少GPU的问题，transform不走任何CPU逻辑，变
> 形之后直接进入GPU)
>
> Q5:GPU有没有开启，只能通过表现来看（帧率），和设备也有关，不能通过调试来看到。GPU(帧率掉得快，发热)

### 4.渲染与动画

###### CPU VS GPU

GPU: 一万个小学生

CPU:一个大学生

###### 渲染出来的颜色和形状

##### 颜色

![image-20200608114018559](C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200608114018559.png)

CMYK 青 品红 蓝 黑

RGB 红黄蓝

![image-20200608114526108](C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200608114526108.png)

H Hue

S 纯度

V 色值

L 亮度/明度

##### 形状

+ border
+ box-shadow
+ border-radius

data uri + svg 可以画所有的矢量图，性能和兼容性都非常好

svg体积不大（相对于位图）,图形越简单svg优势越大，

svg和canvas没有任何相关的地方，svg是（图片的格式）用xml写的，canvas是用js代码画的。





