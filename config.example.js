
exports.server=
 {listen:
   {port:"80"
   }
 };

exports.credentials=
 {cmbc: __dirname+"/cert/cmbcTest.cer",
  my:
   {key:
     {file: __dirname+"/cert/cust0001.sm2",
      password: "123123"
     },
    cert: __dirname+"/cert/cust0001.cer"
   }
 };

exports.jars=
 {sadk: __dirname+"/SADK-CMBC-3.1.0.8.jar"
 };

