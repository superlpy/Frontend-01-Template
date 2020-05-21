### 浏览器工作原理-总论与HTTP协议

1. 当你敲下URL 打下一个回车，直到你看见网页，中间到底发生了什么

   ![image-20200513231758076](C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200513231758076.png)

  

拿到一个URL,把它经过HTTP请求

回来了一堆东西，但我们认为他主体回来的是一个HTML代码

拿到HTML我们就对他进行parse（解析），生成一个DOM树

这时候这个DOM树上缺了很多信息，比如每棵DOM树上，它的CSS是什么样子

所以下一步就是CSS computing 让它具有CSS属性

生成DOM with CSS,然后layout对他进行排版，我们就会得到一个带位置的DOM树

再配合一些DOM上一些其他信息，对他进行render（渲染）

得到一个图片（Bitmap)在内存里面。我们把它显示到屏幕上

***其实里面的每一步都很复杂。我们只是讲了一个大概的骨架***

![image-20200513232804801](C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200513232804801.png)

![image-20200513233143890](C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200513233143890.png)

IP层的话，就会收到很多不属于自己的包。





![image-20200513233601894](C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200513233601894.png)

在TCP的基础上加东西，一定是先request 再 response

服务端不可以主动给你发消息



