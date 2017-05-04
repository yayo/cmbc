
var config = require("./config");
var express = require("express");
var bodyParser = require('body-parser');
var request = require('request');
var java = require("java");

var app = express();
var jsonParser = bodyParser.json({ extended: false })
java.classpath.push(config.jars.sadk);
 
app.get
 ('/',function(req,res)
  {res.redirect("/index.html");
  }
 );

app.get
 ('/cmbc.css',function(req,res)
  {res.sendFile(__dirname +"/html/"+"cmbc.css");
  }
 );

app.get
 ('/const.js',function(req,res)
  {res.end("var platformId=\""+config.credentials.my.platformId+"\";");
  }
 );

app.get
 ('/cmbc.js',function(req,res)
  {res.sendFile(__dirname +"/html/"+"cmbc.js");
  }
 );

app.get
 ('/index.html',function(req,res)
  {res.sendFile(__dirname +"/html/"+"index.html");
  }
 );

app.get
 ('/mchntAdd.html',function(req,res)
  {res.sendFile( __dirname + "/html/" + "mchntAdd.html" );
  }
 );

app.get
 ('/queryMchnt.html',function(req,res)
  {res.sendFile( __dirname + "/html/" + "queryMchnt.html" );
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
  if(!req.body.hasOwnProperty("txnSeq")||""===req.body.txnSeq)
   {res.end(JSON.stringify({"Error":"0==size(txnSeq)"}));
   }
  else
   {var body=JSON.stringify(req.body);
    var signature=java.callStaticMethodSync("com.yayooo.cmbc.cipher","sign",config.credentials.my.key.file,config.credentials.my.key.password,body);
    var upload=java.callStaticMethodSync("com.yayooo.cmbc.cipher","encrypt",config.credentials.cmbc,JSON.stringify({"sign":signature,"body":body}));
    var server="wxpay.cmbc.com.cn";
    request.post
     ({"url":"http://"+server+"/mobilePlatform/lcbpService/"+action+".do","headers":{"Content-Type":"application/json"},"body":JSON.stringify({"businessContext":upload,"merchantNo":"","merchantSeq":"","reserve1":"","reserve2":"","reserve3":"","reserve4":"","reserve5":"","reserveJson":"","securityType":"","sessionId":"","source":"","transCode":"","transDate":"","transTime":"","version":""})},
      function(err,cmbc,download)
       {if(err)
         {res.end(JSON.stringify(err));
         }
        else if(cmbc.statusCode!=200)
         {res.end(JSON.stringify({"server":"wxpay.cmbc.com.cn","statusCode":cmbc.statusCode}));
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
                  if(!o.hasOwnProperty("txnSeq")||req.body.txnSeq!==o.txnSeq)
                   {res.end(JSON.stringify({"Error":"txnSeq"}));
                   }
                  else
                   {Colorful(o);
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
         o.cmbcMchntId="<b class=\"success\">"+o.cmbcMchntId+"</b>";
        res.end(JSON.stringify(o));
       }
     );
   }
 );

app.post('/queryMchnt.html',jsonParser,function(req,res){post(req,res,"queryMchnt",function(o){res.end(JSON.stringify(o));});});

var server=app.listen
 (config.server.listen.port,function()
  {console.log("Listening: %s:%s",server.address().address,server.address().port)
  }
 );

