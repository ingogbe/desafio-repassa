module.exports = function (app, firebaseAdmin, ajv, passport) {

   var db = app.config.database.firestore;
   var ratingsCollection = process.env.ACCOUNT_COLLECTION || "ratings";
   var accountsCollection = process.env.ACCOUNT_COLLECTION || "accounts";

   return {
      get: function (accountId, ratingId) {
         return db.collection(accountsCollection)
            .doc(accountId)
            .collection(ratingsCollection)
            .doc(ratingId)
            .get();
      },

      create: function (accountId, obj) {
         return db.collection(accountsCollection)
            .doc(accountId)
            .collection(ratingsCollection)
            .add(obj);
      },

      delete: function(accountId, ratingId){
         return db.collection(accountsCollection)
            .doc(accountId)
            .collection(ratingsCollection)
            .doc(ratingId)
            .delete();
      },

      update: function(accountId, ratingId, obj){
         return db.collection(accountsCollection)
            .doc(accountId)
            .collection(ratingsCollection)
            .doc(ratingId)
            .update(obj);
      },

      list: function(accountId){
         return db.collection(accountsCollection)
            .doc(accountId)
            .collection(ratingsCollection)
            .get();
      }
   }

}