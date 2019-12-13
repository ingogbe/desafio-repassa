module.exports = function (app, firebaseAdmin, ajv, passport) {

   var db = app.config.database.firestore;
   var firestore = app.config.database.firestoreRaw;
   var accountsCollection = process.env.ACCOUNT_COLLECTION || app.config.files.fallback.ACCOUNT_COLLECTION;


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

      delete: function (id) {
         return db.collection(accountsCollection)
            .doc(id)
            .delete();
      },

      batchDelete: function (ids) {
         var batch = db.batch();

         ids.forEach((item, index) => {
            var ref = db.collection(accountsCollection).doc(item);
            batch.delete(ref);
         });

         return batch.commit();
      },

      update: function (obj, id) {
         return db.collection(accountsCollection)
            .doc(id)
            .update(obj);
      },

      listEmployees: function () {
         return db.collection(accountsCollection)
            .where('role', '==', 'employee')
            .get();
      },

      listAdmins: function () {
         return db.collection(accountsCollection)
            .where('role', '==', 'admin')
            .get();
      },

      increment: firestore.FieldValue.increment(1),
      decrement: firestore.FieldValue.increment(-1),
      collection: accountsCollection
   }

}