'use strict';
const net = require('net');


const server = net.createServer((socket) => {
  socket.on('data',(data)=>{
    const res = app(parseRequest(data.toString()));
    socket.end(serialize(res));
  });
}).on('error', (err) => {
  throw err;
});

server.listen({
  host: 'localhost',
  port: 8888
},() => {
  const address = server.address();
  console.log('opened server on %j', address);
});

function app(req){
  console.log(req.path)
  if(req.path === "/"){
    return {
      code:"200",
      headers:{"Content-Type":"text/plain"},
      body:"hello world"
      }
    }
  else if(req.path === "/json"){
    return {
      code:"200",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(req)
      }
  }
  else {
    return {
      code:"404",
      headers:{"Content-Type":"text/plain"},
      body:"Not Found"
    }
  }

}

function parseRequest(str){
  const a = str.split('\r\n');
  const methodurl = a.shift();
  const body = a.pop();
  a.pop();
  let headers = {}
  for(const i in a){
    const temp = a[i].split(": ")
    headers[temp[0]]=temp[1];
  }
  let request = {
    method:methodurl.split(" ")[0],
    path:methodurl.split(" ")[1],
    headers:headers
  }
  const temp = headers["Content-Length"]
  if(temp){
    request['body'] = body.substring(0,parseInt(temp));
  }
  return request
}

//const test = "POST /foo\r\nReferer: /baz\r\nContent-Length: 5\r\nfhdajksfhaksjdfhkasjdhf";
//console.log(parse(test));

function serialize(obj){
   let temp = `HTTP/1.0 ${obj.code}\r\n`;
   const keys = Object.keys(obj.headers);
   for(const i in keys){
     temp += `${keys[i]}: ${obj.headers[keys[i]]}\r\n\r\n`
   }
   temp+=obj.body
   return temp;
}

//console.log(serialize({code:"200",headers:{Content:"dtsda"},body:'adfasdf'}))
