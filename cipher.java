
package com.yayooo.cmbc;

public class cipher
 {private cfca.util.cipher.lib.Session session;
  private cfca.x509.certificate.X509Cert[] cmbcs;
  private java.security.PublicKey cmbcp;
  private cfca.sm2.signature.SM2PrivateKey key;
  private cfca.x509.certificate.X509Cert cert;
  private java.security.PublicKey pub;

  public cipher(java.lang.String cmbcCert,java.lang.String myKey,java.lang.String myPass,java.lang.String myCert)
   {try
     {cfca.util.cipher.lib.JCrypto.getInstance().initialize(cfca.util.cipher.lib.JCrypto.JSOFT_LIB,null);
      session=cfca.util.cipher.lib.JCrypto.getInstance().openSession(cfca.util.cipher.lib.JCrypto.JSOFT_LIB);
      try
       {cfca.x509.certificate.X509Cert cmbc=cfca.x509.certificate.X509CertHelper.parse(cmbcCert);
        cfca.x509.certificate.X509Cert[] s={cmbc};
        cmbcs=s;
        cmbcp=cmbc.getPublicKey();
        key=cfca.util.KeyUtil.getPrivateKeyFromSM2(myKey,myPass);
        cert=cfca.util.CertUtil.getCertFromSM2(myKey);
        cfca.x509.certificate.X509Cert c=cfca.x509.certificate.X509CertHelper.parse(myCert);
        pub=c.getPublicKey();
       }
      catch(java.io.IOException e)
       {e.printStackTrace();
       }
     }
    catch(cfca.sm2rsa.common.PKIException e)
     {e.printStackTrace();
     }
   }
  public java.lang.String sign(java.lang.String i)
   {java.lang.String o="";
    try
     {byte[] b=i.getBytes("UTF8");
      try
       {o=new java.lang.String(new cfca.util.SignatureUtil2().p1SignMessage(cfca.sm2rsa.common.Mechanism.SM3_SM2,b,key,session));
       }
      catch(cfca.sm2rsa.common.PKIException e)
       {e.printStackTrace();
       }
     }
    catch(java.io.UnsupportedEncodingException e)
     {e.printStackTrace();
     }
    return(o);
   }

  public java.lang.String encrypt(java.lang.String i)
   {java.lang.String o="";
    try
     {byte[] b=i.getBytes("UTF8");
      try
       {@SuppressWarnings("deprecation")
        byte[] d=cfca.util.EnvelopeUtil.envelopeMessage(b,cfca.sm2rsa.common.Mechanism.SM4_CBC,cmbcs);
        o=new java.lang.String(d,"UTF-8");
       }
      catch(cfca.sm2rsa.common.PKIException e)
       {e.printStackTrace();
       }
     }
    catch(java.io.UnsupportedEncodingException e)
     {e.printStackTrace();
     }
    return(o);
   }
 
  public java.lang.String decrypt(java.lang.String i)
   {java.lang.String o="";
    try
      {byte[] b=i.getBytes("UTF8");
      try
       {byte[] d=cfca.util.EnvelopeUtil.openEvelopedMessage(b,key,cert,session);
        o=new java.lang.String(d,"UTF8");
       }
      catch(cfca.sm2rsa.common.PKIException e)
       {e.printStackTrace();
       }
     }
    catch(java.io.UnsupportedEncodingException e)
     {e.printStackTrace();
     }
    return(o);
   }
  public boolean verify(boolean my,java.lang.String i,java.lang.String s)
   {boolean o=false;
    try
     {byte[] b=i.getBytes("UTF8");
      try
       {o=new cfca.util.SignatureUtil2().p1VerifyMessage(cfca.sm2rsa.common.Mechanism.SM3_SM2,b,s.getBytes(),(my?pub:cmbcp),session);
       }
      catch(cfca.sm2rsa.common.PKIException e)
       {e.printStackTrace();
       }
     }
    catch(java.io.UnsupportedEncodingException e)
     {e.printStackTrace();
     }
    return(o);
   }
 }

