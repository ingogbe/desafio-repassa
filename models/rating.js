module.exports = function (app, firebaseAdmin, ajv, passport) {

   var db = app.config.database.firestore;
   var ratingsCollection = process.env.RATING_COLLECTION || app.config.files.fallback.RATING_COLLECTION;
   var accountsCollection = process.env.ACCOUNT_COLLECTION || app.config.files.fallback.ACCOUNT_COLLECTION;

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