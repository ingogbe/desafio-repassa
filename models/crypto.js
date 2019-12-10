module.exports = function (app, firebaseAdmin, ajv, passport) {
   const crypto = require('crypto');
   const algorithm = process.env.CIPHER_ALGORITHM || 'aes-192-cbc';
   const secret = process.env.CIPHER_SECRET || "secret-keygen-185161181811";
   const inputEncoding = process.env.CIPHER_INPUT_ENCODING || "utf8";
   const outputEncoding = process.env.CIPHER_OUTPUT_ENCODING || "hex";

   return {
      encrypt: (value) => {
         const key = crypto.scryptSync(secret, 'salt', 24);
         const iv = Buffer.alloc(16, 0);

         const cipher = crypto.createCipheriv(algorithm, key, iv);
         let encrypted = cipher.update(value, inputEncoding, outputEncoding);
         encrypted += cipher.final(outputEncoding);

         return encrypted;
      },

      decrypt: (encyptedValue) => {
         const key = crypto.scryptSync(secret, 'salt', 24);
         const iv = Buffer.alloc(16, 0);

         const decipher = crypto.createDecipheriv(algorithm, key, iv);

         let decrypted = decipher.update(encyptedValue, outputEncoding, inputEncoding);
         decrypted += decipher.final(inputEncoding);
         
         return decrypted;
      }
   }
}