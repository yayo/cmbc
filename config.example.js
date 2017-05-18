
exports.server=
 {listen:
   {port:"80"
   },
  cmbc:"http://wxpay.cmbc.com.cn/mobilePlatform/lcbpService/"
 };

exports.credentials=
 {cmbc: __dirname+"/cert/cmbcTest.cer",
  my:
   {platformId: "A00002016120000000294",
    key:
     {file: __dirname+"/cert/cust0001.sm2",
      password: "123123"
     },
    cert: __dirname+"/cert/cust0001.cer"
   }
 };

