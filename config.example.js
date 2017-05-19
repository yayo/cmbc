
exports.server=
 {listen:
   {bind: "0.0.0.0",
    port:"443",
    key: __dirname+"/"+"cert/Serve1r.key",
    cert: __dirname+"/"+"cert/Serve1r.crt",
    ca: __dirname+"/"+"cert/CA_Tes1t.topcreate.cn.crt",
   },
  cmbc:"http://wxpay.cmbc.com.cn/mobilePlatform/lcbpService/",
 };

exports.client=
 {platformId: "A00002016120000000294",
 };

exports.credentials=
 {cmbc: __dirname+"/"+"cert/cmbcTest.cer",
  my:
   {key:
     {file: __dirname+"/"+"cert/cust0001.sm2",
      password: "123123",
     },
    cert: __dirname+"/"+"cert/cust0001.cer",
   }
 };

