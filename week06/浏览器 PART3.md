# 浏览器 PART3

1. ```javascript
   var css = require('css');
   var obj = css.parser('body{font-size: 12px;}',options);
   css.stringify(obj,options);
   ```

2. 在引用css时

   + 只考虑style里面的文本内容，不考虑含有link的情况
   + options我们不考虑，那是做sortMap的时候才用到的，我们时需要关注property和value

3. 只要有一个element创建的过程，就会有一个csscomputing的过程

4. 在做第二步  **添加调用** 的时候，最重要的是找到位置。

   我们会在元素创建之后并且它的tagName && 属性都添加了，才会进行computeCSS

5. computeCSS不同于我们之前对于style的创建，我们需要尽可能早的去调用它

6. 一般在html,和head里面我们不会添加什么属性，在body，match到的时候才会进行一个渲染，也就是从body开始才会有rules

7. 不考虑CSS重绘的情况。重排一定会重绘

8. body里面含有style标签就会回溯，但是我们不考虑这种情况

9. 在做第三步  获取父元素序列的时候，在入栈也就是push的时候，给他一个parent属性，这样就可以逐级的去寻找它的parent。  这里因为我们把 computeCSS和htmlParse放在了，所以我们可以直接从栈里，取父元素

10. 每个瞬间，stack里面存储的就是所有的父元素

11. slice()方法本来是有两个参数的，如果两个参数都不传。相当于把原数组复制一遍，在这里  ` var elements = stack. slice() .reverse();` 就相当于把stack赋值一遍，

    因为stack他是不断变化的，所以我们在后续操作的时候为了避免污染它就要先把他保存起来（防御式编程）

12. **这里使用reverse()的原因，**

    因为CSS规则匹配的时候先找**当前元素**是否匹配，不会先找父元素，父元素匹配具有不确定性。所以是从里往外找的。