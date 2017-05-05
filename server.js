
var config=require("./config");
var express=require("express");
var bodyParser=require("body-parser");
var formidable=require('formidable')
var request=require("request");
var java=require("java");
var fs=require('fs');
var md5=require('md5');
var sqlite=require('sqlite3');

var app=express();
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
 ('/',function(req,res)
  {res.redirect("/index.html");
  }
 );
app.get
 ('/cmbc.css',function(req,res)
  {res.sendFile(__dirname+"/html/"+"cmbc.css");
  }
 );
app.get
 ('/const.js',function(req,res)
  {res.end("var platformId=\""+config.credentials.my.platformId+"\";");
  }
 );
app.get
 ('/cmbc.js',function(req,res)
  {res.sendFile(__dirname+"/html/"+"cmbc.js");
  }
 );
app.get
 ('/spark-md5.js',function(req,res)
  {res.sendFile(__dirname+"/html/"+"spark-md5.js");
  }
 );
app.get
 ('/out2cmbc',function(req,res)
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
 ('/index.html',function(req,res)
  {res.sendFile(__dirname+"/html/"+"index.html");
  }
 );
app.get
 ('/mchntAdd.html',function(req,res)
  {res.sendFile( __dirname+ "/html/" + "mchntAdd.html" );
  }
 );
app.get
 ('/queryMchnt.html',function(req,res)
  {res.sendFile( __dirname+ "/html/" + "queryMchnt.html" );
  }
 );
app.get
 ('/upload.html',function(req,res)
  {res.sendFile( __dirname+ "/html/" + "upload.html" );
  }
 );

function Colorful(o)
 {if(o.hasOwnProperty("respCode"))
   {if("0000"!==o.respCode)
     {o.respCode="<b class=\"failed\">"+o.respCode+"</b>";
     }
    else
     {o.respCode="<b class=\"success\">"+o.respCode+"</b>";
     }
   }
  if(o.hasOwnProperty("errorMsg"))
   {if("执行成功"!==o.errorMsg)
     {o.errorMsg="<b class=\"failed\">"+o.errorMsg+"</b>";
     }
    else
     {o.errorMsg="<b class=\"success\">"+o.errorMsg+"</b>";
     }
   }
 }

function post(req,res,action,process)
 {console.log(req.connection.remoteAddress+":"+req.connection.remotePort);
  console.log(req.body);
  if(!req.body.hasOwnProperty("txnSeq")||!req.body.hasOwnProperty("platformId")||""===req.body.txnSeq||req.body.platformId!==config.credentials.my.platformId)
   {res.end(JSON.stringify({"Error":"txnSeq||platformId"}));
   }
  else
   {var body=JSON.stringify(req.body);
    var signature=java.callStaticMethodSync("com.yayooo.cmbc.cipher","sign",config.credentials.my.key.file,config.credentials.my.key.password,body);
    var upload=java.callStaticMethodSync("com.yayooo.cmbc.cipher","encrypt",config.credentials.cmbc,JSON.stringify({"sign":signature,"body":body}));
    var url=config.server.cmbc+action+".do";
    request.post
     ({"url":url,"headers":{"Content-Type":"application/json"},"body":JSON.stringify({"businessContext":upload,"merchantNo":"","merchantSeq":"","reserve1":"","reserve2":"","reserve3":"","reserve4":"","reserve5":"","reserveJson":"","securityType":"","sessionId":"","source":"","transCode":"","transDate":"","transTime":"","version":""})},
      function(err,cmbc,download)
       {if(err)
         {res.end(JSON.stringify(err));
         }
        else if(cmbc.statusCode!=200)
         {res.end(JSON.stringify({"url":url,"statusCode":cmbc.statusCode}));
         }
        else
         {console.log(download);
          download=JSON.parse(download);
          if(""===download.businessContext)
           {res.end(JSON.stringify(download));
           }
          else
           {var result=java.callStaticMethodSync("com.yayooo.cmbc.cipher","decrypt",config.credentials.my.key.file,config.credentials.my.key.password,download.businessContext);
            if(""===result)
             {res.end(JSON.stringify({"Error":"decrypt"}));
             }
            else
             {try
               {var o=JSON.parse(result);
                signature=java.callStaticMethodSync("com.yayooo.cmbc.cipher","verify",config.credentials.cmbc,o.body,o.sign);
                if(true!==signature)
                 {res.end(JSON.stringify({"Error":"verify"}));
                 }
                else
                 {o=JSON.parse(o.body);
                  if(!o.hasOwnProperty("txnSeq")||!o.hasOwnProperty("platformId")||!o.hasOwnProperty("outMchntId")||o.txnSeq!==req.body.txnSeq||o.outMchntId!==req.body.outMchntId||o.platformId!==config.credentials.my.platformId)
                   {res.end(JSON.stringify({"Error":"platformId||txnSeq"}));
                   }
                  else
                   {delete(o.platformId);
                    Colorful(o);
                    process(o);
                   }
                 }
               }
              catch(e)
               {res.end(JSON.stringify({"Error":"JSON.parse","value":result}));
               }
             }
           }
         }
       }
     );
   }
 }

app.post
('/mchntAdd.html',jsonParser,
  function(req,res)
   {post
     (req,res,"mchntAdd",
      function(o)
       {if(o.hasOwnProperty("cmbcMchntId")&&""!==o.cmbcMchntId)
         {db.exec
           ("INSERT INTO out2cmbc values(\""+o.outMchntId+"\",\""+o.cmbcMchntId+"\");",
            function(err)
             {if(null!==err)
               console.log(err);
             }
           );
          o.cmbcMchntId="<b class=\"success\">"+o.cmbcMchntId+"</b>";
         }
        res.end(JSON.stringify(o));
       }
     );
   }
 );

app.post('/queryMchnt.html',jsonParser,function(req,res){post(req,res,"queryMchnt",function(o){res.end(JSON.stringify(o));});});

app.post
 ('/upload.html',
  function(req,res)
   {
    var form=new formidable.IncomingForm({hash:true,multiples:true});
    form.hash=true;
    form.multiples=true;
    form.parse
     (req,
      function(err,fields,files)
       {
        console.log(fields);
        //console.log(files);
        var s={};
        var m={};
        var d={};
        var f;
        for(f in files)
         {console.log(f);
          console.log(files[f].size);
          console.log(files[f].path);
          var h=md5(fs.readFileSync(files[f].path,{flag:'r'}));
          if(d.hasOwnProperty(h)&&d[h].size===files[f].size)
           {res.end("{\"Error\":\"Duplicate\",\"file1\":\""+d[h].name+"\",\"file2\":\""+files[f].name+"\"}");
           }
          else
           {d[h]=files[f];
            s[f]=files[f].size;
            m[f]=h;
           }
         }
        res.end("{\"Error\":\"O3K\"}");
       }
     );
   }
 );

var server=app.listen
 (config.server.listen.port,function()
  {console.log("Listening: %s:%s",server.address().address,server.address().port)
  }
 );

