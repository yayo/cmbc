
var config=require("./config");
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
 ('/mchntUpd.html',function(req,res)
  {res.sendFile( __dirname+ "/html/" + "mchntUpd.html" );
  }
 );
app.get
 ('/queryMchnt.html',function(req,res)
  {res.sendFile( __dirname+ "/html/" + "queryMchnt.html" );
  }
 );
app.get
 ('/chnlAdd.html',function(req,res)
  {res.sendFile( __dirname+ "/html/" + "chnlAdd.html" );
  }
 );
app.get
 ('/chnlUpd.html',function(req,res)
  {res.sendFile( __dirname+ "/html/" + "chnlUpd.html" );
  }
 );
app.get
 ('/queryChnl.html',function(req,res)
  {res.sendFile( __dirname+ "/html/" + "queryChnl.html" );
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
  if(o.hasOwnProperty("outMchntId")&&""!==o.outMchntId)
   {o.outMchntId=o.outMchntId+"<b class=\"success\"><a href=\"chnlAdd.html?outMchntId="+o.outMchntId+"\">支付</a>|<a href=\"upload.html?outMchntId="+o.outMchntId+"\">上传</a></b>";
   }
  if(o.hasOwnProperty("cmbcSignId")&&""!==o.cmbcSignId)
   {o.cmbcSignId="<b class=\"success\">"+o.cmbcSignId+"</b>";
   }
 }

function encode(res,i)
 {
  if(!i.hasOwnProperty("txnSeq")||!i.hasOwnProperty("platformId")||""===i.txnSeq||i.platformId!==config.credentials.my.platformId)
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
     {
      o=java.callStaticMethodSync("com.yayooo.cmbc.cipher","encrypt",config.credentials.cmbc,JSON.stringify({"sign":s,"body":o}));
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

function decode(p,res,err,cmbc,download,process)
 {
  if(err)
   {res.end(JSON.stringify(err));
   }
  else if(cmbc.statusCode!=200)
   {res.end(JSON.stringify({"Error":"statusCode:"+cmbc.statusCode}));
   }
  else
   {
    //console.log(download);
    download=JSON.parse(download);
    if(""===download.businessContext)
     {res.end(JSON.stringify(download));
     }
    else
     {err=java.callStaticMethodSync("com.yayooo.cmbc.cipher","decrypt",config.credentials.my.key.file,config.credentials.my.key.password,download.businessContext);
      if(""===err)
       {res.end(JSON.stringify({"Error":"decrypt"}));
       }
      else
       {
        try
         {
          var cmbc=JSON.parse(err);
          err=java.callStaticMethodSync("com.yayooo.cmbc.cipher","verify",config.credentials.cmbc,cmbc.body,cmbc.sign);
          if(true!==err)
           {res.end(JSON.stringify({"Error":"verify"}));
           }
          else
           {
            cmbc=JSON.parse(cmbc.body);
            if(!cmbc.hasOwnProperty("txnSeq")||!cmbc.hasOwnProperty("platformId")||!cmbc.hasOwnProperty("outMchntId")||cmbc.txnSeq!==p.txnSeq||cmbc.outMchntId!==p.outMchntId||cmbc.platformId!==config.credentials.my.platformId)
             {res.end(JSON.stringify({"Error":"platformId||txnSeq"}));
             }
            else
             {
              delete(cmbc.platformId);
              Colorful(cmbc);
              process(cmbc);
             }
           }
         }
        catch(e)
         {res.end(JSON.stringify({"Error":"JSON.parse","value":err}));
         }
       }
     }
   }
 }

function post(req,res,action,process)
 {console.log(req.connection.remoteAddress+":"+req.connection.remotePort);
  console.log(req.body);
  var body=encode(res,req.body);
  if(undefined!==body)
   {var url=config.server.cmbc+action+".do";
   console.log(url);
    request.post
     ({"url":url,"headers":{"Content-Type":"application/json"},"body":JSON.stringify(body)},
      function(e,cmbc,download)
       {decode(req.body,res,e,cmbc,download,process);
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

app.post('/mchntUpd.html',jsonParser,function(req,res){post(req,res,"mchntUpd",function(o){res.end(JSON.stringify(o));});});
app.post('/queryMchnt.html',jsonParser,function(req,res){post(req,res,"queryMchnt",function(o){res.end(JSON.stringify(o));});});
app.post('/chnlAdd.html',jsonParser,function(req,res){post(req,res,"chnlAdd",function(o){res.end(JSON.stringify(o));});});
app.post('/chnlUpd.html',jsonParser,function(req,res){post(req,res,"chnlUpd",function(o){res.end(JSON.stringify(o));});});
app.post('/queryChnl.html',jsonParser,function(req,res){post(req,res,"queryChnl",function(o){res.end(JSON.stringify(o));});});

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
         {
         }
        else
         {var p=JSON.parse(fields["uploadContext"]);
          if(undefined===fields["edType"])
           {
           }
          else
           {
            if(undefined===fields["sizes"])
             {
             }
            else
             {var upFileCount=Object.keys(files).length;
              var s=JSON.parse(fields["sizes"]);
              if(Object.keys(s).length!==upFileCount)
               {
               }
              else
               {
                if(undefined===fields["md5s"])
                 {
                 }
                else
                 {
                  var md5s=JSON.parse(fields["md5s"]);
                  if(Object.keys(md5s).length!==upFileCount)
                   {
                   }
                  else
                   {p["edType"]=fields["edType"];
                    p["upFileCount"]=""+upFileCount;
                    p["md5s"]=md5s;
                    //console.log(JSON.stringify(p));
                    var u=encode(res,p);
                    if(undefined!==u)
                     {var form={"uploadContext":JSON.stringify(u)};
                      var d={};
                      var f;
                      for(f in files)
                       {
                        if(!s.hasOwnProperty(f))
                         {
                          return;
                         }
                        else
                         {if(files[f].size!==s[f])
                           {
                            return;
                           }
                          else
                           {
                            if(!md5s.hasOwnProperty(f))
                             {
                              return;
                             }
                            else
                             {
                              var h=md5(fs.readFileSync(files[f].path,{flag:'r'}));
                              if(h!==md5s[f])
                               {
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
                        function(e,cmbc,download)
                         {decode(p,res,e,cmbc,download,function(o){res.end(JSON.stringify(o));});
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

var server=app.listen
 (config.server.listen.port,function()
  {console.log("Listening: %s:%s",server.address().address,server.address().port)
  }
 );

