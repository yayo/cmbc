
package com.yayooo.cmbc;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.PrivateKey;
import java.security.PublicKey;
import cfca.sm2.signature.SM2PrivateKey;
import cfca.sm2rsa.common.Mechanism;
import cfca.sm2rsa.common.PKIException;
import cfca.util.CertUtil;
import cfca.util.EnvelopeUtil;
import cfca.util.KeyUtil;
import cfca.util.SignatureUtil2;
import cfca.util.cipher.lib.JCrypto;
import cfca.util.cipher.lib.Session;
import cfca.x509.certificate.X509Cert;
import cfca.x509.certificate.X509CertHelper;


public class cipher
 {
  public static String sign(String k,String p,String i)
   {String o="";
    try
     {JCrypto.getInstance().initialize(JCrypto.JSOFT_LIB,null);
      Session n=JCrypto.getInstance().openSession(JCrypto.JSOFT_LIB);
      SM2PrivateKey e=KeyUtil.getPrivateKeyFromSM2(k,p);
      o=new String(new SignatureUtil2().p1SignMessage(Mechanism.SM3_SM2,i.getBytes("UTF8"),e,n));
     }
    catch(PKIException e)
     {e.printStackTrace();
     }
    catch(UnsupportedEncodingException e)
     {e.printStackTrace();
     }
    return(o);
   }

  public static String encrypt(String c,String i)
   {String o="";
    X509Cert p=null;
    try
     {p=X509CertHelper.parse(c);
      try
       {X509Cert[] k={p};
        @SuppressWarnings("deprecation")
        byte[] d=EnvelopeUtil.envelopeMessage(i.getBytes("UTF8"),Mechanism.SM4_CBC,k);
        try
         {o=new String(d,"UTF-8");
         }
        catch(UnsupportedEncodingException e)
         {e.printStackTrace();
         }
       }
      catch(UnsupportedEncodingException e)
       {e.printStackTrace();
       }
      catch(PKIException e)
       {e.printStackTrace();
       }
     }
    catch(IOException e)
     {e.printStackTrace();
     }
    catch(PKIException e)
     {e.printStackTrace();
     }
    return(o);
   }
 
  public static String decrypt(String k,String p,String i)
   {String o="";
    try
     {JCrypto.getInstance().initialize(JCrypto.JSOFT_LIB,null);
      Session n=JCrypto.getInstance().openSession(JCrypto.JSOFT_LIB);
      PrivateKey r=KeyUtil.getPrivateKeyFromSM2(k,p);
      X509Cert c=CertUtil.getCertFromSM2(k);
      try
       {byte[] sourceData=EnvelopeUtil.openEvelopedMessage(i.getBytes("UTF8"),r,c,n);
        o=new String(sourceData,"UTF8");
       }
      catch(UnsupportedEncodingException e)
       {e.printStackTrace();
       }
     }
    catch(PKIException e)
     {e.printStackTrace();
     }
    return(o);
   }
  public static boolean verify(String c,String i,String s)
   {boolean o=false;
    try
     {JCrypto.getInstance().initialize(JCrypto.JSOFT_LIB,null);
      Session n=JCrypto.getInstance().openSession(JCrypto.JSOFT_LIB);
      try
       {X509Cert p=X509CertHelper.parse(c);
        PublicKey k=p.getPublicKey();
        o=new SignatureUtil2().p1VerifyMessage(Mechanism.SM3_SM2,i.getBytes("UTF8"),s.getBytes(),k,n);
       }
      catch(IOException e)
       {e.printStackTrace();
       }
     }
    catch(PKIException e)
     {e.printStackTrace();
     }
    return(o);
   }

 }

