const http=require('http'),fs=require('fs'),path=require('path');
const port=4178;
const types={'.html':'text/html;charset=utf-8','.js':'text/javascript','.css':'text/css','.png':'image/png','.kml':'application/vnd.google-earth.kml+xml'};
http.createServer((req,res)=>{
  let f=decodeURIComponent(req.url.split('?')[0]);
  if(f==='/')f='/poster.html';
  const fp=path.join(__dirname,f);
  fs.readFile(fp,(e,d)=>{
    if(e){res.writeHead(404);res.end('not found');return;}
    res.writeHead(200,{'Content-Type':types[path.extname(fp)]||'application/octet-stream','Cache-Control':'no-store, no-cache, must-revalidate'});
    res.end(d);
  });
}).listen(port,()=>console.log('preview on '+port));
