module.exports = function (app, firebaseAdmin, ajv, passport) {

   var db = app.config.database.firestore;
   var accountsCollection = process.env.ACCOUNT_COLLECTION || "accounts";

   return {
      get: function (id) {
         return db.collection(accountsCollection)
            .doc(id)
            .get();
      },

      create: function (obj) {
         return db.collection(accountsCollection)
            .add(obj);
      },

      delete: function(id){
         return db.collection(accountsCollection)
            .doc(id)
            .delete();
      },

      update: function(obj, id){
         return db.collection(accountsCollection)
            .doc(id)
            .update(obj);
      },

      listEmployees: function(){
         return db.collection(accountsCollection)
            .where('role', '==', 'employee')
            .get();
      },

      listAdmins: function(){
         return db.collection(accountsCollection)
            .where('role', '==', 'admin')
            .get();
      }
   }

}