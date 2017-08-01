exports.server=
 {listen:
   {bind: "0.0.0.0",
    port: "443",
    tls:
     {key: __dirname+"/"+"cert/Serve1r.key",
      cert: __dirname+"/"+"cert/Serve1r.crt",
      verify:
       {ca: __dirname+"/"+"cert/CA_Tes1t.crt",
       },
     },
   },
  sqlite: __dirname+"/"+"cmbc.db",
 };

exports.client=
 {platformId: "A00002016120000000294",
  api: "https://wxpay.cmbc.com.cn/mobilePlatform/",
  qrcode: "https://wxpay.cmbc.com.cn/mobilePlatform/appQrcodeserver/qrcode.do",
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

exports.reconcile=
 {mail:
   {smtp:
     {host: "smtp.exmail.qq.com",
      port: 465,
      secure: true,
      auth:
       {user: "alert@YOU_MAIL.net",
        pass: "YOUR_PASSWORD",
       },
     },
    from: "cmbc通知",
    to: "yayooo@gmail.com,44678123@qq.com",
    subject: "cmbc日报",
   },
  types: ["WX","LSY","ZFB"],
  // schedule: -1, /* -1=yesterday ... one day report */
  schedule: "01 05 * * *", /* crontab schedules report */
  checkDays: -9,
  keepLog: -32,
 }

