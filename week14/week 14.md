# week 14 组件化

1. HTMLParse就是一个很好的去做组件化的方案，viewJs有SFC (Simple File Component)

2. JSX是一种JavaScript的语法扩展，运用于[React](https://baike.baidu.com/item/React/18077599)架构中，其格式比较像是模版语言，但事实上完全是在[JavaScript](https://baike.baidu.com/item/JavaScript/321142)内部实现的。元素是构成React应用的最小单位，JSX就是用来声明React当中的元素，React使用JSX来描述用户界面。

3. JSX可以使用引号来定义以字符串为值的属性：

   const element = <div tabIndex="0"></div>;

   也可以使用大括号来定义以JavaScript表达式为值的属性：

   const element = <img src={user.avatarUrl} />;

4. 其实它是一个从createElement出发到各个component组件类的体系结构
5. jsx到组件化，jsx只是它的最前端
6. 组件化的核心：怎么恰当地表达property attribute children event 等
7. 