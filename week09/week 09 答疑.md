# week 09 答疑

1. 点击了a元素，移动到b元素上放开，这里就有一个on click down 和 on click up 事件的区分

2. 捕获和点击事件内执行方法关联起来?   点击事件内执行方法传给native层，native接受到这个事件就调用,就像调用一个函数一样

3. 移动端的延迟也要看是什么事件：如果是touch就没有延迟，如果是click就会有延迟

4. 有什么不入侵业务代码上传埋点数据的方式？  **取决于你埋什么点，**如果埋像a标签这种点击，就不需要，(考虑埋点不入侵业务代码就是很关键的事情)，一般来说上传的数据有三种： **跳转，业务数据，性能与错误**，这三类数据都不需要入侵

5. 元素曝光埋点：首先是业务问题,业务怎么定义曝光这个事。停留时间多久算曝光？主要解决滚动问题，监听滚动事件,可以使用passive。不只是scroll会产生曝光，还有轮播图

6. 浏览器设计冒泡，是为了符合人类正常逻辑。冒泡信息多，捕获信息少，

7. add Event Listener是**不会导致内存泄漏**的，现代浏览器按道理来说你的任何操作都不会导致内存泄漏。

8. 无痕就是不要入侵业务代码

9. 埋点属于数据体系，后来被划分叫做数据中台，埋点属于数据中台的前端部分

11. 前端就是解决在用户的电脑上出现的一切问题

12. GPU渲染也是重绘

13. 单击一个按钮，需要JS拼接信息上报,不是必须入侵业务代码的，如果必须要从JS那里获取信息，取出来之后可以把它绑定到按钮的data部分。

13. rn只推荐小型应用

    

    

    

    

    

    

    

    

    
