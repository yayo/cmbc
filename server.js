
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

function post(req,res,action)
 {console.log(req.connection.remoteAddress+":"+req.connection.remotePort);
  console.log(req.body);
  var v1=JSON.stringify(req.body);
  var v2=java.callStaticMethodSync("com.yayooo.cmbc.cipher","sign",config.credentials.my.key.file,config.credentials.my.key.password,v1);
  var v3=java.callStaticMethodSync("com.yayooo.cmbc.cipher","encrypt",config.credentials.cmbc,JSON.stringify({"sign":v2,"body":v1}));
  var server="wxpay.cmbc.com.cn";
  request.post
   ({"url":"http://"+server+"/mobilePlatform/lcbpService/"+action+".do","headers":{"Content-Type":"application/json"},"body":JSON.stringify({"businessContext":v3,"merchantNo":"","merchantSeq":"","reserve1":"","reserve2":"","reserve3":"","reserve4":"","reserve5":"","reserveJson":"","securityType":"","sessionId":"","source":"","transCode":"","transDate":"","transTime":"","version":""})},
    function(err,cmbc,v4)
     {if(err)
       {res.end(JSON.stringify(err));
       }
      else if(cmbc.statusCode!=200)
       {res.end(JSON.stringify({"server":"wxpay.cmbc.com.cn","statusCode":cmbc.statusCode}));
       }
      else
       {console.log(v4);
        v4=JSON.parse(v4);
        if(""===v4.businessContext)
         {res.end(JSON.stringify(v4));
         }
        else
         {var v5=java.callStaticMethodSync("com.yayooo.cmbc.cipher","decrypt",config.credentials.my.key.file,config.credentials.my.key.password,v4.businessContext);
          if(""===v5)
           {res.end(JSON.stringify({"Error":"dec"}));
           }
          else
           {try
             {var v6=JSON.parse(v5);
              var v7=java.callStaticMethodSync("com.yayooo.cmbc.cipher","verify",config.credentials.cmbc,v6.body,v6.sign);
              if(true!==v7)
               {res.end(JSON.stringify({"Error":"verify"}));
               }
              else
               {v7=JSON.parse(v6.body);
                if(req.body.txnSeq!==v7.txnSeq)
                 {res.end(JSON.stringify({"Error":"txnSeq"}));
                 }
                else
                 {res.end(v6.body);
                 }
               }
             }
            catch(e)
             {res.end(JSON.stringify({"Error":"JSON.parse","value":v5}));
             }
           }
         }
       }
     }
   );
 }

app.post('/mchntAdd.html',jsonParser,function(req,res){post(req,res,"mchntAdd");});
app.post('/queryMchnt.html',jsonParser,function(req,res){post(req,res,"queryMchnt");});

var server=app.listen
 (config.server.listen.port,function()
  {console.log("Listening: %s:%s",server.address().address,server.address().port)
  }
 );

