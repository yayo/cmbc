
var config_file="./config";
var config=require(config_file);
const http2=require("spdy");
var express=require("express");
var bodyParser=require("body-parser");
var formidable=require("formidable")
var request=require("request");
var FormData=require("form-data");
var java=require("java");
var fs=require("fs");
var md5=require("md5");
var sqlite=require("sqlite3");

var app=express();
app.disable("x-powered-by");
var config_file_mtime=(new Date(fs.statSync(__dirname+"/"+config_file+".js")["mtime"])).toGMTString();
var jsonParser=bodyParser.json({extended: false})
java.classpath.push(__dirname+"/SADK-CMBC-3.1.0.8.jar");

var db=new sqlite.Database
 ("cmbc.db",sqlite.OPEN_READWRITE|sqlite.OPEN_CREATE,
  function()
   {db.get
     ("SELECT name FROM sqlite_master WHERE type=\"table\" AND name=\"out2cmbc\";",
      function(err,row)
       {if(null===err&&undefined===row)
         {db.exec
           ("CREATE TABLE out2cmbc(out VARCHAR(64) PRIMARY KEY, cmbc VARCHAR(21) NOT NULL UNIQUE);",
            function(err)
             {if(null!==err)
               {console.log(err);
               }
             }
           );
         }
       }
     );
   }
 );
app.get
 ("/",function(req,res)
  {res.redirect("/index.html");
  }
 );
app.get
 ("/time",function(req,res)
  {res.setHeader("Content-Type","text/plain; charset=UTF-8");
   res.setHeader("Cache-Control","no-cache");
   res.end((new Date()).toISOString()+"\r\n"+req.connection._spdyState.parent.localAddress+":"+req.connection._spdyState.parent.localPort+"\r\n"+req.headers["host"]+"\r\n"+req.connection.remoteAddress+":"+req.connection.remotePort+"\r\n"+req.headers["user-agent"]);
  }
 );
app.get
 ("/favicon.ico",function(req,res)
  {res.sendFile(__dirname+"/html/"+"favicon.ico");
  }
 );
app.get
 ("/cache.manifest",function(req,res)
  {res.setHeader("Content-Type","text/cache-manifest");
   res.sendFile(__dirname+"/html/"+"cache.manifest");
  }
 );
app.get
 ("/spark-md5.js",function(req,res)
  {res.setHeader("Content-Encoding","gzip");
   res.setHeader("Content-Type","application/javascript; charset=UTF-8");
   res.sendFile(__dirname+ "/html/"+"spark-md5.js.gz" );
  }
 );
app.get
 ("/qrcode.min.js",function(req,res)
  {res.setHeader("Content-Encoding","gzip");
   res.setHeader("Content-Type","application/javascript; charset=UTF-8");
   /* gzip -9c node_modules/qrcode/build/qrcode.min.js > html/qrcode.min.js.gz */
   res.sendFile(__dirname+ "/html/"+"qrcode.min.js.gz" );
  }
 );
app.get
 ("/area2code20170310_1471429.js",function(req,res)
  {res.setHeader("Content-Encoding","gzip");
   res.setHeader("Content-Type","application/javascript; charset=UTF-8");
   res.sendFile(__dirname+ "/html/"+"area2code20170310_1471429.js.gz" );
  }
 );
app.get
 ("/const.js",function(req,res)
  {res.setHeader("Cache-Control","public, max-age=0");
   res.setHeader("Last-Modified",config_file_mtime);
   if(req.headers.hasOwnProperty("if-modified-since")&&req.headers["if-modified-since"]===config_file_mtime)
    res.sendStatus(304);
   else
    res.end("var client="+JSON.stringify(config.client)+";");
  }
 );
app.get
 ("/offline.js",function(req,res)
  {res.end("var client="+JSON.stringify(Object.assign({},config.client,{"platformId":"CAN NOT REACH SERVER"}))+";");
  }
 );
function resources(res)
 {var s1=res.push
   ("/cmbc.css",
    {request:{"accept":"*/*"},
     response:{"content-type":"text/css; charset=UTF-8"}
    }
   );
  s1.on("error",function(){});
  // fs.createReadStream(__dirname+"/html/"+"cmbc.css").pipe(s1); /* CRASHED */
  s1.end(fs.readFileSync(__dirname+"/html/"+"cmbc.css")); /* OK */
  var s2=res.push
   ("/cmbc.js",
    {request:{"accept":"*/*"},
     response:{"content-type":"application/javascript; charset=UTF-8"}
    } 
   );
  s2.on("error",function(){});
  // fs.createReadStream(__dirname+"/html/"+"cmbc.css").pipe(s2); /* CRASHED */
  s2.end(fs.readFileSync(__dirname+"/html/"+"cmbc.js")); /* OK */
 }
app.get
 ("/out2cmbc",function(req,res)
  {if(undefined===req.query["out"])
    {res.end("");
    }
   else
    {db.get
      ("SELECT cmbc FROM out2cmbc WHERE out=\""+req.query["out"]+"\";",
       function(e,r)
        {if(null!==e)
          {console.log(e);
           res.end("");
          }
         else
          {if(undefined===r)
            {res.end("");
            }
           else
            {if(!r.hasOwnProperty("cmbc"))
              {res.end("");
              }
             else
              {res.end(r["cmbc"]);
              }
            }
          }
        }
      );
    }
  }
 );
app.get
 ("/index.html",function(req,res)
  {res.sendFile(__dirname+"/html/"+"index.html");
  }
 );
app.get
 ("/mchntAdd.html",function(req,res)
  {resources(res);
   res.sendFile(__dirname+ "/html/"+"mchntAdd.html" );
  }
 );
app.get
 ("/mchntUpd.html",function(req,res)
  {resources(res);
   res.sendFile(__dirname+ "/html/"+"mchntUpd.html" );
  }
 );
app.get
 ("/queryMchnt.html",function(req,res)
  {resources(res);
   res.sendFile(__dirname+ "/html/"+"queryMchnt.html" );
  }
 );
app.get
 ("/chnlAdd.html",function(req,res)
  {resources(res);
   res.sendFile(__dirname+ "/html/"+"chnlAdd.html" );
  }
 );
app.get
 ("/chnlUpd.html",function(req,res)
  {resources(res);
   res.sendFile(__dirname+ "/html/"+"chnlUpd.html" );
  }
 );
app.get
 ("/queryChnl.html",function(req,res)
  {resources(res);
   res.sendFile(__dirname+ "/html/"+"queryChnl.html" );
  }
 );
app.get
 ("/upload.html",function(req,res)
  {resources(res);
   res.sendFile(__dirname+ "/html/"+"upload.html" );
  }
 );
app.get
 ("/push",
  function(req,res)
   {res.setHeader("Content-Type","text/event-stream");
    res.setHeader("Cache-Control","no-cache");
    res.setHeader("Connection","keep-alive");
    res.status(200);
    res.write("retry:60000\n");
    var t=setInterval
     (function()
       {res.write("event: ping\n");
        res.write("data: "+(new Date()).getTime()+"\n\n");
       },
      1000
     );
    req.connection.addListener("close",function(){clearInterval(t);},false);
   }
 );

function encode(res,i)
 {if(!i.hasOwnProperty("txnSeq")||!i.hasOwnProperty("platformId")||""===i.txnSeq||i.platformId!==config.client.platformId)
   {res.end(JSON.stringify({"Error":"txnSeq||platformId"}));
    return(undefined);
   }
  else
   {var o=JSON.stringify(i);
    var s=java.callStaticMethodSync("com.yayooo.cmbc.cipher","sign",config.credentials.my.key.file,config.credentials.my.key.password,o);
    if(""===s)
     {res.end(JSON.stringify({"Error":"SADK-CMBC::sign"}));
      return(undefined);
     }
    else
     {o=java.callStaticMethodSync("com.yayooo.cmbc.cipher","encrypt",config.credentials.cmbc,JSON.stringify({"sign":s,"body":o}));
      if(""===o)
       {res.end(JSON.stringify({"Error":"SADK-CMBC::encrypt"}));
        return(undefined);
       }
      else
       {return({"businessContext":o,"merchantNo":"","merchantSeq":"","reserve1":"","reserve2":"","reserve3":"","reserve4":"","reserve5":"","reserveJson":"","securityType":"","sessionId":"","source":"","transCode":"","transDate":"","transTime":"","version":""});
       }
     }
   }
 }

function decode(i,res,action,e,cmbc,body)
 {if(e)
   {res.end(JSON.stringify(e));
   }
  else if(cmbc.statusCode!=200)
   {res.end(JSON.stringify({"Error":"statusCode:"+cmbc.statusCode}));
   }
  else
   {console.log(body);
    body=JSON.parse(body);
    if(""===body.businessContext)
     {res.end(JSON.stringify(body));
     }
    else
     {e=java.callStaticMethodSync("com.yayooo.cmbc.cipher","decrypt",config.credentials.my.key.file,config.credentials.my.key.password,body.businessContext);
      if(""===e)
       {res.end(JSON.stringify({"Error":"decrypt"}));
       }
      else
       {try
         {var cmbc=JSON.parse(e);
          console.log(cmbc.body);
          e=java.callStaticMethodSync("com.yayooo.cmbc.cipher","verify",config.credentials.cmbc,cmbc.body,cmbc.sign);
          if(true!==e)
           {res.end(JSON.stringify({"Error":"verify"}));
           }
          else
           {cmbc=JSON.parse(cmbc.body);
            if(!cmbc.hasOwnProperty("txnSeq")||!cmbc.hasOwnProperty("platformId")||!cmbc.hasOwnProperty("outMchntId")||cmbc.txnSeq!==i.txnSeq||cmbc.outMchntId!==i.outMchntId||cmbc.platformId!==config.client.platformId)
             {res.end(JSON.stringify({"Error":"platformId||txnSeq||outMchntId"}));
             }
            else
             {if(cmbc.hasOwnProperty("respCode")&&"0000"===cmbc.respCode)
               {if(cmbc.hasOwnProperty("cmbcMchntId")&&""!==cmbc.cmbcMchntId)
                 {if("mchntAdd"===action)
                   {db.exec
                     ("INSERT INTO out2cmbc values(\""+cmbc.outMchntId+"\",\""+cmbc.cmbcMchntId+"\");",
                      function(e)
                       {if(null!==e)
                         console.log(e);
                       }
                     );
                   }
                  e="&merchantNum="+cmbc.cmbcMchntId+"&platformId="+config.client.platformId;
                  i=java.callStaticMethodSync("com.yayooo.cmbc.cipher","sign",config.credentials.my.key.file,config.credentials.my.key.password,e);
                  if(""!==i&&true===java.callStaticMethodSync("com.yayooo.cmbc.cipher","verify",config.credentials.my.cert,e,i))
                   {cmbc["qrcode"]=i;
                   }
                 }
               }
              res.end(JSON.stringify(cmbc));
             }
           }
         }
        catch(e)
         {res.end(JSON.stringify({"Error":"JSON.parse","value":e}));
         }
       }
     }
   }
 }

function post(req,res,action)
 {console.log(req.connection.remoteAddress+":"+req.connection.remotePort+" => "+action);
  req=req.body;
  console.log(JSON.stringify(req));
  var body=encode(res,req);
  if(undefined!==body)
   {var url=config.server.cmbc+action+".do";
    request.post
     ({"url":url,"headers":{"Content-Type":"application/json"},"body":JSON.stringify(body)},
      function(e,cmbc_res,cmbc_body)
       {decode(req,res,action,e,cmbc_res,cmbc_body);
       }
     );
   }
 }

app.post('/mchntAdd.html',jsonParser,function(req,res){post(req,res,"mchntAdd");});
app.post('/mchntUpd.html',jsonParser,function(req,res){post(req,res,"mchntUpd");});
app.post('/queryMchnt.html',jsonParser,function(req,res){post(req,res,"queryMchnt");});
app.post('/chnlAdd.html',jsonParser,function(req,res){post(req,res,"chnlAdd");});
app.post('/chnlUpd.html',jsonParser,function(req,res){post(req,res,"chnlUpd");});
app.post('/queryChnl.html',jsonParser,function(req,res){post(req,res,"queryChnl");});

app.post
 ('/upload.html',
  function(req,res)
   {var form=new formidable.IncomingForm({hash:true,multiples:true});
    form.hash=true;
    form.multiples=true;
    form.parse
     (req,
      function(err,fields,files)
       {if(undefined===fields["uploadContext"])
         {res.end(JSON.stringify({"Error":"NOT_FOUND","value":"uploadContext"}));
         }
        else
         {var p=JSON.parse(fields["uploadContext"]);
          if(undefined===fields["edType"])
           {res.end(JSON.stringify({"Error":"NOT_FOUND","value":"edType"}));
           }
          else
           {if(undefined===fields["sizes"])
             {res.end(JSON.stringify({"Error":"NOT_FOUND","value":"sizes"}));
             }
            else
             {var upFileCount=Object.keys(files).length;
              var s=JSON.parse(fields["sizes"]);
              if(Object.keys(s).length!==upFileCount)
               {res.end(JSON.stringify({"Error":"COUNT","value":"sizes"}));
               }
              else
               {if(undefined===fields["md5s"])
                 {res.end(JSON.stringify({"Error":"NOT_FOUND","value":"md5s"}));
                 }
                else
                 {var md5s=JSON.parse(fields["md5s"]);
                  if(Object.keys(md5s).length!==upFileCount)
                   {res.end(JSON.stringify({"Error":"COUNT","value":"md5s"}));
                   }
                  else
                   {p["edType"]=fields["edType"];
                    p["upFileCount"]=""+upFileCount;
                    p["md5s"]=md5s;
                    console.log(JSON.stringify(p));
                    var u=encode(res,p);
                    if(undefined!==u)
                     {var form={"uploadContext":JSON.stringify(u)};
                      var d={};
                      var f;
                      for(f in files)
                       {if(!s.hasOwnProperty(f))
                         {res.end(JSON.stringify({"Error":"NOT_INCLUDE","sizes":f}));
                          return;
                         }
                        else
                         {if(files[f].size!==s[f])
                           {res.end(JSON.stringify({"Error":"NOT_MATCH","size":f}));
                            return;
                           }
                          else
                           {if(!md5s.hasOwnProperty(f))
                             {res.end(JSON.stringify({"Error":"NOT_INCLUDE","md5s":f}));
                              return;
                             }
                            else
                             {var h=md5(fs.readFileSync(files[f].path,{flag:'r'}));
                              if(h!==md5s[f])
                               {res.end(JSON.stringify({"Error":"NOT_MATCH","md5":f}));
                                return;
                               }
                              else
                               {
                                if(d.hasOwnProperty(h)&&d[h].size===files[f].size)
                                 {res.end("{\"Error\":\"Duplicate\",\"file1\":\""+d[h].name+"\",\"file2\":\""+files[f].name+"\"}");
                                  return;
                                 }
                                else
                                 {d[h]=files[f];
                                  form[f]={"options":{"filename":f+".jpg","contentType":"image/jpeg"},"value":fs.createReadStream(files[f].path)};
                                 }
                               }
                             }
                           }
                         }
                       }
                      var url=config.server.cmbc+"upload"+".do";
                      request.post
                       ({"url":url,"formData":form},
                        function(e,cmbc_res,cmbc_body)
                         {decode(p,res,"upload",e,cmbc_res,cmbc_body);
                         }
                       );
                     }
                   }
                 }
               }
             }
           }
         }
       }
     );
   }
 );

http2.createServer
 ({protocols: ["h2"],
   plain: false,
   key: fs.readFileSync(config.server.listen.key),
   cert: fs.readFileSync(config.server.listen.cert),
   requestCert: true,
   rejectUnauthorized: true,
   ca: [fs.readFileSync(config.server.listen.ca)],
  },
  app
 ).listen(config.server.listen.port,config.server.listen.bind);

