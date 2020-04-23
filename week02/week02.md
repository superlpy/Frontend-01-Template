## Week 02

#### 1.写一个正则表达式  匹配所有的number直接量

##### 		Numeric Literals

```
/^(\.\d+|(0|[1-9]\d*)\.?\d*?)([eE][-\+]?\d+)?$|^0[bB][01]+$|^0[oO][0-7]+$|^0[xX][0-9a-fA-F]+$/
```



​		十进制直接量

```
/^(\.\d+|(0|[1-9]\d*)\.?\d*?)([eE][-\+]?\d+)?$/
```

​		十六进制直接量：以`ox`或者`oX`为前缀

```
/^0[xX][0-9a-fA-F]+$/
```

​		八进制直接量：以`0o`或者`0O`为前缀

```
/^0[oO][0-7]+$/
```

​		二进制直接量：`0b` 或者`0B`为前缀

```
/^0[bB][01]+$/	
```

#### 2.写一个UTF-8 Encoding 的函数

```
function UTF8Encoding(str) {
  const code = encodeURIComponent(str)
  const bytes = []

  for (let i = 0; i < code.length; i++) {
    const c = code.charAt(i)
    if (c === '%') {
      const hex = code.charAt(i + 1) + code.charAt(i + 2)
      const hexVal = parseInt(hex, 16)
      bytes.push(hexVal)
      i += 2
    } else {
      bytes.push(c.charCodeAt(0))
    }
  }
  return bytes
}
```



#### 3. 写一个正则表达式，匹配所有的字符串直接量，单引号和双引号

```
/^([^"\\\n\r]|\\(u([0-9a-fA-F]{4}|\{(10|0?[0-9a-fA-F])[0-9a-fA-F]{0,4}\})|x[0-9a-fA-F]{2}|0(?!=\d)|\r\n|[^\dxu])*$/u
```

```
/^([^'\\\n\r]|\\(u([0-9a-fA-F]{4}|\{(10|0?[0-9a-fA-F])[0-9a-fA-F]{0,4}\})|x[0-9a-fA-F]{2}|0(?!=\d)|\r\n|[^\dxu])*$/u
```

