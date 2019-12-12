module.exports = function (app, firebaseAdmin, ajv, passport) {

   var db = app.config.database.firestore;

   //Custom Keyword para o modulo AVJ para checar se existe um atributo X no em uma collecion Y no BD
   //(schema, data) = (JSON com a tabela e atributo, valor do campo testado)
   //schema example: {"table":"driver", "attr":"phone"}
   //data Ã© o valor do campo onde esse keyword foi utilizado
   function checkAttrIsFree(schema, data) {
      try {

         if (schema.attr == 'id') {
            //return true or false if attr exists
            return db.collection(schema.collection).doc(data).get().then(doc => {
               if (!doc.exists) {
                  return true;
               } else {
                  return false;
               }
            }).catch(err => {
               return false;
            });
         } else {
            if (schema.attr == "phone") {
               data = data.replace(/\(|\)|-|\s/g, "");
            } else if (schema.attr == "email") {
               data = data.replace(/\s/g, "");
            } else if (schema.attr == "cpf") {
               data = data.replace(/\s|-|\./g, "");
            }

            //return true or false if attr is free to use
            return db.collection(schema.collection).where(schema.attr, '==', data).limit(1).get().then(doc => {
               if (doc.size > 0) {
                  return false;
               } else {
                  return true;
               }
            }).catch(err => {
               return false;
            });
         }



      } catch (err) {
         return false
      }
   }

   function checkAttrIsFreeOrSame(schema, data) {
      try {

         if (schema.attr == "phone") {
            data = data.replace(/\(|\)|-|\s/g, "");
         } else if (schema.attr == "email") {
            data = data.replace(/\s/g, "");
         } else if (schema.attr == "cpf") {
            data = data.replace(/\s|-|\./g, "");
         }

         //return true or false if attr is free to use
         return db.collection(schema.collection).where(schema.attr, "==", data).limit(1).get().then(doc => {
            if (doc.size > 0) {
               var ref = doc.docs[0].data();
               ref.id = doc.docs[0].id;
               
               if(schema.id == ref.id){
                  //same
                  return true;
               }
               else{
                  //not same not free
                  return false
               }
            } else {
               //free
               return true;
            }
         }).catch(err => {
            return false;
         });

      } catch (err) {
         return false
      }
   }

   function checkIfExists(schema, data) {
      try {

         schema.attr = schema.attr.replace(/\$data/g, data);
         schema.collection = schema.collection.replace(/\$data/g, data);


         if (schema.attr == 'id') {
            //return true or false if attr exists
            return db.collection(schema.collection).doc(data).get().then(doc => {
               if (!doc.exists) {
                  return false;
               } else {
                  return true;
               }
            }).catch(err => {
               return false;
            });
         } else {
            if (schema.attr == "email") {
               data = data.replace(/\s/g, "");
            }

            return db.collection(schema.collection).where(schema.attr, '==', data).limit(1).get().then(doc => {
               if (doc.size > 0) {
                  return true;
               } else {
                  return false;
               }
            }).catch(err => {
               return false;
            });
         }
      } catch (err) {
         return false
      }

   }

   //================================================================================================================

   ajv.addKeyword("checkAttrIsFree", {
      async: true,
      type: "string",
      validate: checkAttrIsFree
   });

   ajv.addKeyword("checkIfExists", {
      async: true,
      type: ["string", "object"],
      validate: checkIfExists
   });

   return {
      checkAttrIsFreeOrSame: checkAttrIsFreeOrSame,
      checkIfExists: checkIfExists,
      checkAttrIsFree: checkAttrIsFree
   }

}