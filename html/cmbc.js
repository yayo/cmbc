
var cmbc_interface=
 {"mchntAdd":"基础信息注册",
  "mchntUpd":"基础信息修改",
  "chnlAdd":"支付通道绑定",
  "chnlUpd":"支付通道信息修改",
  "queryMchnt":"基础信息查询",
  "queryChnl":"支付通道信息查询",
  "upload":"电子资料信息上传",
 }

var edType=
 {"01":["营业执照",1],
  "08":["法人/负责人身份证",2],
  "06":["商户协议",1],
  "02":["业务申请表",3],
  "04":["银行卡",2],
  "07":["店铺照片",4],
  //"03":["其他A",1],
  //"05":["其他B",1],
 }

var c2n=
 {/*code: name | mandatory | disabled | readonly | hidden */
  "txnSeq":["流水号",1,1,1,0],
  "platformId":["平台号",1,1,1,0],
  "operId":["拓展人员编号",1,0,0,0],
  "dataSrc":["进件渠道",1,1,1,0],
  "outMchntId":["外部商户号",1,0,0,0],
  "cmbcMchntId":["民生商户号",1,0,0,0],
  "mchntName":["商户简称",1,0,0,0],
  "mchntFullName":["公司全称",1,0,0,0],
  "parentMchntId":["父商户",0,0,0,0],
  "devType":["拓展模式",1,0,0,0],
  "acdCode":["区域代码",1,0,0,0],
  "province":["省份",1,0,0,0],
  "city":["城市",1,0,0,0],
  "address":["地址",1,0,0,0],
  "isCert":["是否持证",1,0,0,0],
  "licId":["营业执照号",1,0,0,0],
  "licValidity":["营业执照有效期",1,0,0,0],
  "corpName":["法人/联系人",1,0,0,0],
  "idtCard":["法人/联系人证件号",1,0,0,0],
  "contactName":["负责人",1,0,0,0],
  "telephone":["负责人手机号",1,0,0,0],
  "servTel":["客服电话",1,0,0,0],
  "identification":["客户识别码",0,0,0,0],
  "autoSettle":["结算方式",1,0,0,0],
  "industryId":["商户类别",1,0,0,0],
  "operateType":["接入类型",1,0,0,0],
  "dayLimit":["日限额",1,0,0,0],
  "monthLimit":["月限额",1,0,0,0],
  "fixFeeRate":["固定比例费率",2,0,0,0],
  "specFeeRate":["特殊费率",2,0,0,0],
  "account":["结算账号",1,0,0,0],
  "pbcBankId":["开户行号",0,0,0,0],
  "acctName":["开户人",1,0,0,0],
  "acctType":["账户类型",1,0,0,0],
  "idType":["开户人证件类型",0,0,0,0],
  "idCode":["证件号码",0,0,0,0],
  "acctTelePhone":["开户人预留手机号",0,0,0,0],
  "edType":["资料分类",1,0,0,0],
  "upFileCount":["本次上传文件数 ",1,0,0,0],
  "md5s":["资料MD5",1,0,0,0],
  "remark":["备注",0,0,0,0],
  "message":["备用字段",0,0,0,0],
  "service":["接口类型",1,0,0,0],
  "status":["商户状态",1,0,0,0],
  "cmbcSignId":["民生签约编号",1,0,0,0],
  "apiCode":["支付通道",1,0,0,0],
  "respCode":["返回码",1,0,0,0],
  "errorMsg":["错误信息",1,0,0,0],
  "refuseMsg":["拒绝原因",0,0,0,0],
 };

function serial()
 {var t=Math.random();
  t=(""+t).substring(2);
  t=t+("0".repeat(18-t.length));
  return((new Date).getTime()+""+t);
 }

function out2cmbc(i)
 {if(""===i.value)
   {var p=(new URL(document.location)).searchParams;
    i.value=p.get("outMchntId");
   }
  if(""!==i.value)
   {var o=document.getElementsByName("cmbcMchntId")[0];
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

function file_change(n)
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
          edType_file_append(t);
         }
       }
     }
    r.readAsBinaryString(n.files[0]);
   }
 }

function edType_file_append(i)
 {var t=document.getElementById("t");
  var h=document.getElementById("f"+i);
  if(6>h.rowSpan)
   {var s=false;
    for(var l=h.parentNode.rowIndex+h.rowSpan-1;l>h.parentNode.rowIndex;l--)
     {if(""===t.rows[l].cells[1].firstChild.value)
       {s=true;
        break;
       }
     }
    if(!s)
     {var r=t.insertRow(h.parentNode.rowIndex+h.rowSpan);
      v=document.createElement("td");
      v.appendChild(document.createTextNode(h.rowSpan));
      r.appendChild(v);
      v=document.createElement("td");
      var f=document.createElement("input");
      f["type"]="file";
      f["name"]="file_"+i+"_"+h.rowSpan;
      f.addEventListener("change",file_change);
      v.appendChild(f);
      r.appendChild(v);
      v=document.createElement("td");
      v.appendChild(document.createTextNode("文件长度需小于等于200KB"));
      r.appendChild(v);
      h.rowSpan++;
     }
   }
 }

window.onload=function()
 {document.f.txnSeq.value=serial();
  document.f.platformId.value=platformId;
  var r1=[[undefined,1],[undefined,1]];
  var t=document.getElementById("t");
  var i=window.location.pathname.substring(1);
  i=cmbc_interface[i.substring(0,i.length-5)];
  document.title=i;
  t.rows[0].cells[0].innerText=i;
  var r;
  for(i=0;r=t.rows[i];i++)
   {if(undefined===r.cells[1])
     {if(1!=r.cells[0].rowSpan)
       {if(undefined===r1[0][0])
         r1[0][0]=i;
        else
         r1[1][0]=i;
       }
     }
    else
     {var n=r.cells[1].firstChild.name;
      if(c2n.hasOwnProperty(n))
       {r.cells[0].innerText=c2n[n][0];
        if(0===c2n[n][1])
         {r.cells[1].firstChild.classList.add("option");
          //r.cells[2].innerText="";
         }
        else if(1===c2n[n][1])
         {r.cells[1].firstChild.classList.add("mandatory");
          //r.cells[2].innerText="*";
         }
        else if(2===c2n[n][1])
         {r.cells[1].firstChild.classList.add("oneintwo");
          //r.cells[2].innerText=?;
         }
        r.cells[1].firstChild.disabled=(0!==c2n[n][2]);
        r.cells[1].firstChild.readOnly=(0!==c2n[n][3]);
        if(0!==c2n[n][4])
         {r.style.display="none";
         }
        else
         {r.style.display="auto";
          if(undefined===r1[1][0])
           r1[0][1]++;
          else
           r1[1][1]++;
         }
       }
      else
       {r.cells[0].innerText="";
       }
     }
   }
  t.rows[r1[0][0]].cells[0].rowSpan=r1[0][1];
  t.rows[r1[1][0]].cells[0].rowSpan=r1[1][1];

  if("/upload.html"===window.location.pathname)
   {for(i in edType)
     {var r;
      r=t.insertRow(document.getElementById("b").parentNode.parentNode.rowIndex);
      var v;
      v=document.createElement("td");
      v["id"]="f"+i;
      v["rowSpan"]=1;
      v.appendChild(document.createTextNode(edType[i][0]));
      r.appendChild(v);
      for(var l=0;l<edType[i][1];l++)
       {edType_file_append(i);
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
     {n.addEventListener("change",file_change);
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
    v.appendChild(document.createTextNode(c2n.hasOwnProperty(i)?c2n[i][0]:""));
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

