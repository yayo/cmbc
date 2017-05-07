
var edType=
 {"01":"营业执照",
  "02":"业务申请表",
  "03":"其他A",
  "04":"银行卡",
  "05":"其他B",
  "06":"商户协议",
  "07":"店铺照片",
  "08":"法人/负责人身份证"
 }

var c2n=
 {"txnSeq":"流水号",
  "platformId":"平台号",
  "operId":"拓展人员编号",
  "dataSrc":"进件渠道",
  "outMchntId":"外部商户号",
  "cmbcMchntId":"民生商户号",
  "mchntName":"商户简称",
  "mchntFullName":"公司全称",
  "parentMchntId":"父商户",
  "devType":"拓展模式",
  "acdCode":"区域代码",
  "province":"省份",
  "city":"城市",
  "address":"地址",
  "isCert":"是否持证",
  "licId":"营业执照号",
  "licValidity":"营业执照有效期",
  "corpName":"法人/联系人",
  "idtCard":"法人/联系人证件号",
  "contactName":"负责人",
  "telephone":"负责人手机号",
  "servTel":"客服电话",
  "identification":"客户识别码",
  "autoSettle":"结算方式",
  "industryId":"商户类别",
  "operateType":"接入类型",
  "dayLimit":"日限额",
  "monthLimit":"月限额",
  "fixFeeRate":"固定比例费率",
  "specFeeRate":"特殊费率",
  "account":"结算账号",
  "pbcBankId":"开户行号",
  "acctName":"开户人",
  "acctType":"账户类型",
  "idType":"开户人证件类型",
  "idCode":"证件号码",
  "acctTelephone":"开户人预留手机号",
  "edType":"资料分类",
  "upFileCount":"本次上传文件数 ",
  "md5s":"资料MD5",
  "remark":"备注",
  "message":"备用字段",
  "service":"接口类型",
  "status":"商户状态",
  "cmbcSignId":"民生签约编号",
  "apiCode":"支付通道",
  "respCode":"返回码",
  "errorMsg":"错误信息",
  "refuseMsg":"拒绝原因",
 };

function serial()
 {var t=Math.random();
  t=(""+t).substring(2);
  t=t+("0".repeat(18-t.length));
  return((new Date).getTime()+""+t);
 }

function out2cmbc(i)
 {if(""!==i.value)
   {var o=document.getElementById("cmbcMchntId");
    if(null!==o&&""==o.value)
     {var http=new XMLHttpRequest();
      http.open("GET","/out2cmbc?out="+i.value,true);
      http.onreadystatechange=function()
       {if(4===http.readyState)
         {if(200!==http.status)
           {alert(http.statusText);
           }
          else
           {var v=http.responseText.trim();
            if(""!==v)
             o.value=v;
           }
         }
       };
      http.send();
     }
   }
 }

function foreach_input(i,f)
 {var t=document.f;
  for(var e=0;e<t.length;e++)
   {var n=t[e];
    var m=n["name"];
    if("file"==n.getAttribute('type')&&9===m.length&&"file_0"===m.substring(0,6))
     f(n);
    else
     i(n);
   }
 }

var md5s={};
var submits={};

function check_file_size_name(n)
 {var f=n.files[0];
  var m=f.name;
  if(5>m.length||".jpg"!==m.substring(m.length-4).toLowerCase())
   {n.type="";
    alert("NOT .jpg");
    n.type="file";
    return("");
   }
  else
   {m=m.substring(0,m.length-4);
    var l=4;
    var u=204800;
    if(f.size<l)
     {n.type="";
      alert("size("+f.name+")="+f.size+"<"+l);
      n.type="file";
      return("");
     }
    else
     {if(f.size>u)
       {n.type="";
        alert("size("+f.name+")="+f.size+">"+u);
        n.type="file";
        return("");
       }
      else
       {return(m);
       }
     }
   }
 }

function check_file_md5(m)
 {var n=0;
  for(var i in md5s)
   {if(m===md5s[i])
     n++;
   }
  return(n);
 }

window.onload=function()
 {document.f.txnSeq.value=serial();
  document.f.platformId.value=platformId;
  var t=document.getElementById("t");
  var i,r;
  for(i=0;r=t.rows[i];i++)
   {if(undefined!==r.cells[1])
     {var n=r.cells[1].firstChild.name;
      if(c2n.hasOwnProperty(n))
       {r.cells[0].innerText=c2n[n];
       }
      else if(9==n.length&&"file_0"===n.substring(0,6))
       {r.cells[0].innerText=edType[n.substring(5,7)]+n.substring(8,9);
        r.cells[3].innerText="文件长度需小于等于200KB";
       }
      else
       {r.cells[0].innerText="";
       }
     }
   }
  foreach_input
   (function(n)
     {if("outMchntId"===n.name)
       {out2cmbc(n);
       }
     },
    function(n)
     {n.addEventListener
       ("change",
        function(n)
         {n=n.target;
          if(""!==check_file_size_name(n))
           {var m=new SparkMD5();
            var r=new FileReader();
            r.onload=function(s)
             {m.appendBinary(s.target.result);
              if(2==s.target.readyState)
               {m=m.end();
                var e=n.name.substring(5);
                if(0!==check_file_md5(m))
                 {n.type="";
                  alert("Duplicate_MD5: "+m);
                  delete(md5s[e]);
                  n.type="file";
                 }
                else
                 {md5s[e]=m;
                  var t=e.substring(0,2);
                  if(undefined===submits[t]) submits[t]={};
                  submits[t][e.substring(3)]=n;
                 }
               }
             }
            r.readAsBinaryString(n.files[0]);
           }
         }
       );
     }
   );
 }

function f2o()
 {var r={};
  foreach_input
   (function(n)
     {var m=n["name"];
      if(""!==m)
       r[m]=n["value"];
     },
    function(){}
   );
  return r;
 }

function o2t(o)
 {o=JSON.parse(o);
  var t=document.createElement("table");
  for(i in o)
   {var r=document.createElement("tr");
    t.appendChild(r);
    var v;
    v=document.createElement("td");
    v.appendChild(document.createTextNode(i));
    r.appendChild(v);
    v=document.createElement("td");
    v.appendChild(document.createTextNode(c2n.hasOwnProperty(i)?c2n[i]:""));
    r.appendChild(v);
    v=document.createElement("td");
    v.innerHTML=o[i];
    r.appendChild(v);
   }
  t.border="true";
  return(t);
 }

function http_start()
 {var b0=document.f.b.value;
  document.f.b.disabled=true;
  document.f.b.value="Processing";
  document.f.txnSeq.value=serial();
  return(b0);
 }

function onreadystatechange(http,b0,ts,t,next,c)
 {http.onreadystatechange=function()
   {if(4===http.readyState)
     {if(200!==http.status)
       {alert(http.statusText);
       }
      else
       {var l=document.createElement("li");
        l.appendChild(o2t(http.responseText));
        document.getElementById("o").appendChild(l);
        delete(ts[t]);
        if(0!==Object.keys(ts).length)
         {next(b0,ts,c);
         }
        else
         {document.f.b.value=b0;
          document.f.b.disabled=false;
         }
       }
     }
   };
 }

function http_processing(b,p,b0,ts,t,next,c)
 {var http=new XMLHttpRequest();
  http.open("POST",window.location,true);
  if(""!==p)
   {http.setRequestHeader("Content-type",p);
   }
  onreadystatechange(http,b0,ts,t,next,c);
  http.send(b);
 }

function post()
 {var b0=http_start();
  http_processing(JSON.stringify(f2o()),"application/json;charset=UTF-8",b0,[0],0,undefined,undefined);
  return(false);
 }

