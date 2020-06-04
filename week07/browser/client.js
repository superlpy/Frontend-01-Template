const net = require('net');
//HTML parser环节加入
const parser = require("./parser.js");//得到一个parser对象
const render = require("./render.js");
const images = require('images');

class Request{
  //method, url = host + post + path
  //body: k/v
  //headers

  constructor(options){
    this.method = options.method || "GET";
    this.host = options.host;
    this.port = options.port || 80;
    this.path = options.path || "/";
    this.body = options.body || {};
    this.headers = options.headers || {};
    if(!this.headers["Content-Type"]){
      this.headers["Content-Type"] = "application/x-www-form-urlencoded";
    }

    if(this.headers["Content-Type"] === "application/json")
         this.bodyText = JSON.stringify(this.body);
    else if(this.headers["Content-Type"] === "application/x-www-form-urlencoded")
        this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&');
    //  上面的if else-if 相当于 name = "xxxxx" 这部分的实现
    this.headers["Content-Length"] = this.bodyText.length;
  }

  toString(){
    return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r
\r
${this.bodyText}`
// 上面的行前面不可以有缩进，不然在字符串中会出错
  }

  send(connection){
    return new Promise((resolve, reject) => {
      //ResponseParser 添加在这个地方
      const parser = new ResponseParser;

      if (connection){
        connection.write(this.toString());
      }  else {
         connection = net.createConnection({
          host: this.host,
          port: this.port
         }, () => {
         connection.write(this.toString());
        })
      }
      connection.on('data', (data)  => {
        //把data喂给 ResponseParser
        parser.receive(data.toString());
        //触发多少次是不固定的，分几次收到data也是不确定的
        //resolve(data.toString());//on data其实不是很严谨，
        //因为可能含有多个data,body很大的话，就会分成多个data来发
        /* 解析结束body之后，再添加这个函数*/
        if(parser.isFinished){
          resolve(parser.response);
        }
        //console.log(parser.headers);
        connection.end();
      });
      connection.on('error', (err) =>{
        reject(err);
        connection.end();
      });  
  });
  }
}
    

class Response{


}

//产生 Response 这个 Class
class ResponseParser{
  constructor(){
    this.WAITING_STATUS_LINE = 0; 
    this.WAITING_STATUS_LINE_END = 1;
    this.WAITING_HEADER_NAME = 2;
    this.WAITING_HEADER_SPACE = 3;
    this.WAITING_HEADER_VALUE = 4;
    this.WAITING_HEADER_LINE_END = 5;
    this.WAITING_HEADER_BLOCK_END = 6;
    this.WAITING_BODY = 7;

    this.current = this.WAITING_STATUS_LINE;
    this.statusLine = "";
    this.headers = {};
    this.headerName = "";
    this.headerValue = "";
    this.bodyParser = null;

  }

  //结束bodyParser之后再来进行这一步
  get isFinished(){
    return  this.bodyParser && this.bodyParser.isFinished;
  }

  //写正则
  get response() {
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);

    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.content.join('')
    }
  }

  //这里我们偷懒使用了string
  receive(string){
    for(let i = 0; i < string.length; i++){
      this.receiveChar(string.charAt(i));
    }
  }

  //只接受一个字符
  receiveChar(char){
    if(this.current === this.WAITING_STATUS_LINE)//STATUS_LINE是以/r结束的
    {
      //console.log(char.charCodeAt(0));
      if(char === '\r'){
        this.current = this.WAITING_STATUS_LINE_END;
      }else{
        this.statusLine += char;
      }
    }

    else if(this.current === this.WAITING_STATUS_LINE_END){
       if(char === '\n'){
          this.current = this.WAITING_HEADER_NAME;
       }
    }

    else if(this.current === this.WAITING_HEADER_NAME)
    {
      if(char === ':'){
        this.current = this.WAITING_HEADER_SPACE;
      }else if(char === '\r'){//读入的第一个字符就遇到了\r,就跳入BODY状态
        this.current = this.WAITING_HEADER_BLOCK_END;
        if(this.headers['Transfer-Encoding'] === 'chunked'){
          this.bodyParser = new TrunkedBodyParser();
        }
      } 
      else {
        this.headerName += char;
      }
    }

    else if(this.current === this.WAITING_HEADER_SPACE)
    {
      if(char === ' '){
        this.current = this.WAITING_HEADER_VALUE;
      }
    }

    else if(this.current === this.WAITING_HEADER_VALUE)
    {
      if(char === '\r'){
        this.current = this.WAITING_HEADER_LINE_END;
        //因为header是有多行的，所以要把name:value对写进headers
        this.headers[this.headerName] = this.headerValue;
        this.headerName = "";
        this.headerValue = "";
      }else{
        this.headerValue += char;
      }
    }

    else if(this.current === this.WAITING_HEADER_LINE_END)
    {
      if(char === '\n'){
        this.current = this.WAITING_HEADER_NAME;
      }
    }
    //block-end 这个状态要吃掉一个\n
    else if(this.current === this.WAITING_HEADER_BLOCK_END)
    {
      if(char === '\n'){
        this.current = this.WAITING_BODY;
      }
    }
    
    else if(this.current === this.WAITING_BODY)
    {
      this.bodyParser.receiveChar(char)
    }

    
  }
}
  
//形式和ResponseParser差不多
class TrunkedBodyParser{//body部分一定是以0作为结束的
  constructor(){
    this.WAITING_LENGTH = 0;
    this.WAITING_LENGTH_LINE_END = 1;
    this.READING_TRUNK = 2;
    //因为我们知道trunk的长度，所以我们在设置的时候要有一个length来计数
    this.WAITING_NEW_LINE = 3;
    this.WAITING_NEW_LINE_END = 4;

    this.length = 0;
    this.content = []; //这里我们使用数组而不是字符串，因为字符串在进行加法运算的时候性能不是很好

    this.isFinished = false;
    this.current = this.WAITING_LENGTH;
  }

  receiveChar(char){
   //console.log(JSON.stringify(char));
   //console.log(this.current);
   if(this.current === this.WAITING_LENGTH)//length是十六进制
    {
      if(char === '\r'){
        if(this.length === 0){
          //console.log(this.content);
          //console.log("//////");
          this.isFinished =true;
        }
        this.current = this.WAITING_LENGTH_LINE_END;
      }else{
        //采用十六进制
        this.length *= 16;
        this.length += parseInt(char,16);
      }
    }

    else if(this.current === this.WAITING_LENGTH_LINE_END){
      if(char === '\n'){
        this.current = this.READING_TRUNK;
      }
    }

    else if(this.current === this.READING_TRUNK){
      this.content.push(char);
      // 由于使用的是UTF8的编码方式，所以如果使用中文或者超过一个字节的字符，这里的长度会统计失败
      this.length -= getUTF8Length(char);
      if(this.length === 0){
        this.current = this.WAITING_NEW_LINE;
      }
    }

    else if(this.current === this.WAITING_NEW_LINE){
      if(char === '\r'){
        this.current = this.WAITING_NEW_LINE_END;
      }
    }

    else if(this.current === this.WAITING_NEW_LINE_END){
      if(char === '\n'){
        this.current = this.WAITING_LENGTH;
      }
    }
    
  }
}

//mosiya
function getUTF8Length(char){
  let length = char.codePointAt().toString(2).length;
  return length <= 7 ? 1: Math.ceil((length - 1) / 5);
}

  void async function(){
    //API风格
        let request = new Request({
        method: "POST",
        host: "127.0.0.1",
        port: "8088",
        path: "/",
        headers: {
          ["X-Foo2"]: "customed" //对象直接量的写法
        },
        body: {
          name: "superlpy"
        }
  });
  
     let response = await request.send();

     //body完全拿到之后再传给parser,这是在HTML-parser环节加的
     let dom = parser.parseHTML(response.body) ;
    //  console.log(response);
    
    //渲染的话，一定要有viewport的概念
     let viewport = images(800,600);

     //往viewport上面画
    render(viewport, dom);
    
     viewport.save("viewport.jpg");
    // console.log(JSON.stringify(dom, null ,"   "));
    
  }();

/*
const client = net.createConnection({
    host: "127.0.0.1",
    port: 8088 }, () => {
        //'connect' listener
        console.log('connected to server');

        let request = new Request({
          method: "POST",
          host: "127.0.0.1",
          port: "8088",
          path: "/",
          headers: {
            ["X-Foo2"]: "customed" //对象直接量的写法
          },
          body: {
            name: "superlpy"
          }
        })
        
        console.log(request.toString());
        client.write(request.toString());
//     client.write(`
// POST / HTTP/1.1\r
// Content-Type: application/x-www-form-urlencoded\r
// Content-Length: 13\r
// \r
// name=superlpy`);
});

client.on('data', (data)  => {
  console.log(data.toString());
  client.end();
});
client.on('end', () =>{
  console.log('disconnect from server');
});
client.on('error', (err) =>{
  console.log(err);
  client.end();
});
*/