
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
    v.appendChild(document.createTextNode(o[i]));
    r.appendChild(v);
   }
  t.border="true";
  return(t);
 }

function post(f)
 {var b=document.getElementById("b");
  var t=document.getElementById("t");
  b.disabled=true;
  var b0=b.value;
  b.value="Processing";
  var http = new XMLHttpRequest();
  http.open("POST",window.location,true);
  http.setRequestHeader("Content-type","application/json");
  http.onreadystatechange=function()
   {if(http.readyState===4)
     {if(http.status===200)
       {var l=document.createElement("li");
        l.appendChild(o2t(http.responseText));
        t.appendChild(l);
        b.value=b0;
        b.disabled=false;
       }
      else
       {alert(http.statusText);
       }
     }
   };
  http.send(JSON.stringify(f2o(f)));
  return(false);
 }

