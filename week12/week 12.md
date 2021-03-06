# week 12

> PART1  答疑
>
> Q: 模块化？
>
> A: 可复用，AMD,CMD(简单声明模块依赖关系，加载模块的框架），高耦合，低内聚（衡量划分模块标准型的标尺）
>
> Q: 增量编译
>
> Q: optional作业：写带括号的四则运算
>
> Q:方法中声明方法->closure(闭包)
>
> Q: mixin,混合式不建议使用

---

### PART2 笔记 字符串算法

1. 字符串分析算法

   ![image-20200716100822147](C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200716100822147.png)

> KMP 做得好算法复杂度：O(m+n)   做的不好的话就是O(m*n)
>
> WIldCard: 在KMP基础上增加了两种通配符，它的匹配算法可以做到O(m +n)

2. 字典树

   Trie树，空间换时间，用途广泛。它把数字当做可哈希的东西来做。时间复杂度 O(n)。

   可比较但是不可哈希的东西非常少。jore哈希完就没有意义了，他是不可比较的。

   > **答疑小结：**
   >
   > 离散数学里面的概念：偏移性（可比较的）
   >
   > 可哈希性，偏移性的升级版，不但可以比较-还可以比较差多少
   >
   > 四种经典排序： 快排，归并，堆，shell
   >
   > 现实中的数据很少能找到不可哈希的，除非对应一些外部资源（文件）
   >
   > 所有设计字符串的都可以用字典树去处理
   >
   > 数字签名的哈希算法SHA ，是密码学上特别设计的哈希算法，人类不可逆向解除
   >
   > MD5 SHA1 语义信息摘要的哈希算法，它的特点就是：字符串改变一个字符，最后哈希出来的值变得很满。MD5不想让你你想找回规律，避免碰撞，哈希树希望层层分开，哈希表希望有一定的聚拢效果。
   >
   > 字典树可以用于排序

3. 括号匹配（） [] {}

4. wildcard

   > 通配符： * 任意数量，任意字符     |    ？ 一个任意字符
   >
   > *是一个很重要的通配符
   >
   > 一个表达式出现多个*的话，最后一个要匹配的尽量多，前面的要匹配的尽量少
   >
   > ？相当于一个字母，带？的KMP比较复杂（optional 作业）