
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
  "remark":"备注",
  "message":"备用字段",
  "service":"接口类型",
  "status":"商户状态",
  "cmbcSignId":"民生签约编号",
  "apiCode":"支付通道",
  "respCode":"返回码",
  "errorMsg":"错误信息"
 };

function serial()
 {var t=Math.random();
  t=(""+t).substring(2);
  t=t+("0".repeat(18-t.length));
  return((new Date).getTime()+""+t);
 }

window.onload=function()
 {document.f.txnSeq.value=serial();
  document.f.platformId.value=platformId;
  var t=document.getElementById("t");
  var i,r;
  for(i=0;r=t.rows[i];i++)
   {if(undefined!==r.cells[1])
     {var n=r.cells[1].firstChild.name;
      r.cells[0].innerText=c2n.hasOwnProperty(n)?c2n[n]:"";
     }
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
  var http = new XMLHttpRequest();
  http.open("POST",window.location,true);
  http.setRequestHeader("Content-type","application/json");
  http.onreadystatechange=function()
   {if(http.readyState===4)
     {if(http.status===200)
       {var l=document.createElement("li");
        l.appendChild(o2t(http.responseText));
        document.getElementById("o").appendChild(l);
        document.f.b.value=b0;
        document.f.b.disabled=false;
       }
      else
       {alert(http.statusText);
       }
     }
   };
  http.send(JSON.stringify(f2o()));
  return(false);
 }

