
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

function check_file_size(f)
 {var l=4;
  var u=204800;
  if(f.size<l)
   {alert("size("+f.name+")="+f.size+"<"+l);
    return(false);
   }
  else
   {if(f.size>u)
     {alert("size("+f.name+")="+f.size+">"+u);
      return(false);
     }
    else
     {return(true);
     }
   }
 }

function foreach_file(c)
 {var t=document.f;
  for(var i=0;i<t.length;i++)
   {var n=t[i];
    if("file"==n.getAttribute('type'))
     {var m=n["name"];
      if(9===m.length&&"file_0"===m.substring(0,6))
       {c(n);
       }
     }
   }
 }

var sizes={};
var md5s={};
var submits={};

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

  foreach_file
   (function(n)
     {n.addEventListener
       ("change",
        function() 
         {var f=this.files[0];
          if(check_file_size(f))
           {var m=new SparkMD5();
            var r=new FileReader();
            r.onload=function(s)
             {m.appendBinary(s.target.result);
              md5s[f.name]=m.end();
             }
            r.readAsBinaryString(f);
            sizes[f.name]=f.size;
            var e=n.name;
            var t=e.substring(5,7);
            if(undefined===submits[t]) submits[t]={};
            submits[t][e.substring(8,9)]=f.name;
           }
         }
       );
     }
   );
 }

function out2cmbc(i)
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

function f2o()
 {var f=document.f;
  var r={};
  for(var i=0;i<f.length;i++)
   {var t=f[i];
    var n=t["name"];
    if(""!==n){r[n]=t["value"];}
   }
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

function post()
 {document.f.b.disabled=true;
  var b0=document.f.b.value;
  document.f.b.value="Processing";
  document.f.txnSeq.value=serial();
  var http=new XMLHttpRequest();
  http.open("POST",window.location,true);
  http.setRequestHeader("Content-type","application/json");
  http.onreadystatechange=function()
   {if(4===http.readyState)
     {if(200!==http.status)
       {alert(http.statusText);
       }
      else
       {var l=document.createElement("li");
        l.appendChild(o2t(http.responseText));
        document.getElementById("o").appendChild(l);
        document.f.b.value=b0;
        document.f.b.disabled=false;
       }
     }
   };
  http.send(JSON.stringify(f2o()));
  return(false);
 }

