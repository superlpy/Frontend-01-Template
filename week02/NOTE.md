# 每周总结可以写在这里

##### 1.语言

+ 非形式语言
+ 形式语言
  + 0型（无限制文法）
  + 1型 （上下文相关文法）
  + 2型（上下文无关文法）
  + 3型 （正则文法）

##### 2.产生式

+ 可递归
+ 语法结构
  + 基础结构  终结符
  + 复合结构  非终结符

##### 3. JS中很多2型文法，大多数计算机语言都是2型为主

##### 4.图灵完备性（所有编程语言都具有）

+ 命令式-图灵机
  + go to
  + if & while
+ 声明式 -lambda
  + 递归

现在都不允许使用`goto`,if-while限制比较高，比较受青睐

##### 5.动态和静态

+ 动态 

   在用户设备，产品实际运行时，Runtime

+ 静态（静态特性多的话，更适合大规模开发）

   在程序员设备上，产品开发阶段，compile-time

##### 6.类型

+ 强类型（无隐式转换）

+ 弱类型（有隐式转换）

+ 复合类型

  + 结构体   对象
  + 函数签名 参数列表，返回值类型，组成

+ 子类型

  + 协变 同相 子继承父

  + 逆变 反相 父继承子

    凡是可以用Array<parent>的地方就可以用Array<child>

    凡是可以用Function<child>的地方就可以用Function<parent>

    ---

    

##### 1.JS只支持Unicode

##### 2.Codepoints`四位可以表示的范围也叫做（BMP,基本字符平面）

##### 3.JS中的`Input Element`

- `WhiteSpace`
- `LineTerminator`
- `Comment`
- `Token`

##### 4.<ZWNBSP> zero with no break space =BOM

 零宽度空格

##### 5.Token

* Punctuator（符号）

* Literal(常量)

* Identifier-Name(标识名)

  + Identifier

  + Keywords

  + Future reserved keywords enum  

##### 6.字符集

* ASCII 
* Unicode
* UCS(BMP)
* GB(和Unicode完全不同)
  + GB2312
  + GBK(GB13000)
  + GB(18030)
* ISO-8859
* BIG5

##### 7.String-Encoding

* UTF
  + UTF-8 两字节
  + UTF-16 四字节
  + UTF-32

String-语法

+ ​     单双引号中都可以有\转义过的单双引号
  + " "双引号
  + ‘ ’单引号
  + 、、模板文字
+ 字符串模板是一个推荐使用的特性

##### 8.Question

JS用GB2312编码保存，Browser会把编码转换为Unicode再做词/语法吗？

`Js用UTF-8的话会，但是JS使用GB2312的话就不会`

浏览器会对文件格式检查，`Windows`有一个格式检查函数，IE对文件格式检查基于OS



