

const fs = require("fs");
const md5=require("md5");
const cheerio = require("cheerio");

// curl -A '' -O http://www.stats.gov.cn/tjsj/tjbz/xzqhdm/201703/t20170310_1471429.html
// node area2json.js t20170310_1471429.html

let md5s=
 {"426ccadf9d584157affd01d71a0e707d":
   {"url":"http://www.stats.gov.cn/tjsj/tjbz/xzqhdm/201703/t20170310_1471429.html",
    "result":
     {"md5":"fc2c5351bdc1348d0c23317ad1e2e597",
      "file":"area2code20170310_1471429.js",
     },
   },
 }

let f=fs.readFileSync(process.argv[2],{flag:'r'});

let dom=cheerio.load(f);
let r={};
let l1="";
let l2="";

function l23(r,e1,l,v1)
 {
              let e9=e1.children[1];
              if("tag"===e9.type&&"span"===e9.name&&"string"===typeof(e9.attribs["lang"])&&"EN-US"===e9.attribs["lang"])
               {
                let l2k=e9.firstChild;
                if("text"===l2k.type&&null===l2k.prev)
                 {
                  let e10=e9.children[1];
                  if("tag"===e10.type&&"span"===e10.name)
                   {
                    let e11=e10.firstChild;
                    if("text"===e11.type&&null===e11.prev&&null===e11.next&&v1===e11.data)
                     {let e12=e1.children[2];
                      if("span"===e12.name&&"string"===typeof(e12.attribs["style"])&&"font-family: 宋体"===e12.attribs["style"]&&null==e12.next)
                       {let e13=e12.firstChild;
                        if("text"===e13.type&&null===e13.prev&&null===e13.next&&"　".repeat(l-1)===e13.data.substring(0,(l-1)))
                         {
                          if(2===l)
                           {l2=e13.data.substring(1);
                            r[l1][1][l2]=[l2k.data,{}];
                           }
                          else if(3===l)
                           r[l1][1][l2][1][e13.data.substring(2)]=[l2k.data,{}];
                          else throw(l);
                         }
                        else throw(cheerio.html(e13));
                       }
                      else throw(cheerio.html(e12));
                     }
                    else throw(cheerio.html(e11));
                   }
                  else throw(cheerio.html(e10));
                 }
                else throw(cheerio.html(l2k));
               }
              else throw(cheerio.html(e9));
 }

dom("div[class=center_xilan] > div[class=xilan_con] > div[class=TRS_Editor] div[class=TRS_PreAppend]").children().each
 (function(i,e1)
   {
    if("tag"===e1.type&&"p"===e1.name&&"string"===typeof(e1.attribs["class"])&&"MsoNormal"===e1.attribs["class"])
     {
      let e2=e1.firstChild;
      if("tag"===e2.type&&"b"===e2.name) e2=e2.firstChild;
      if("tag"===e2.type)
       {
        if("span"===e2.name&&"string"===typeof(e2.attribs["lang"])&&"EN-US"===e2.attribs["lang"])
         { // level_1
           let l1k=e2.firstChild;
           if("text"===l1k.type&&null===l1k.prev)
            {
             let e7=e2.children[1];
             if("tag"===e7.type&&"span"===e7.name)
              {
               let e8=e7.firstChild;
               if("text"===e8.type&&null===e8.prev&&null===e8.next&&"     "===e8.data)
                {
                 let e4=e1.children[1];
                 if("tag"===e4.type&&"b"===e4.name) e4=e4.firstChild;
                 if("span"===e4.name&&"string"===typeof(e4.attribs["style"])&&"font-family: 宋体"===e4.attribs["style"])
                  {let l1v=e4.firstChild;
                   if("text"===l1v.type&&null===l1v.prev&&null===l1v.next)
                    {
                     l1=l1v.data;
                     r[l1]=[l1k.data,{}];
                    }
                   else throw(cheerio.html(l1v));
                  }
                 else throw(cheerio.html(e4));
                }
               else throw(cheerio.html(e8));
              }
             else throw(cheerio.html(e7));
            }
           else throw(cheerio.html(l1k));
         }
        else if("span"===e2.name&&"string"===typeof(e2.attribs["style"])&&"font-family: 宋体"===e2.attribs["style"])
         {
          let e3=e2.firstChild;
          if("text"===e3.type&&null===e3.prev&&null===e3.next)
           {
            if("　"==e3.data)
             { // level_2
              l23(r,e1,2,"         ");
             }
            else if("　　"==e3.data)
             { // level_3
              l23(r,e1,3,"     ");
             }
            else throw(cheerio.html(e3));
           }
          else
           {
            throw(cheerio.html(e3));
           }
         }
        else
         {
          throw(cheerio.html(e2));
         }
       }
      else
       {
        throw(cheerio.html(e2));
       }
     }
    else
     {
      throw(cheerio.html(e1));
     }
   }
 );

console.log("area2code="+JSON.stringify(r)+";");

