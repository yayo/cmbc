
function serial()
 {var t=Math.random();
  t=(""+t).substring(2);
  t=t+("0".repeat(18-t.length));
  return((new Date).getTime()+""+t);
 }

window.onload=function()
 {document.f.txnSeq.value=serial();
  document.f.platformId.value=platformId;
 }

function f2o(f)
 {var r={};
  for (var i=0;i<f.length;i++)
   {if(""!==f[i]['name']){r[f[i]['name']]=f[i]['value'];}
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
        document.getElementById("t").appendChild(l);
        document.f.b.value=b0;
        document.f.b.disabled=false;
       }
      else
       {alert(http.statusText);
       }
     }
   };
  http.send(JSON.stringify(f2o(document.f)));
  return(false);
 }

