module.exports = function (app, firebaseAdmin, ajv, passport) {

   var db = app.config.database.firestore;
   var accountsCollection = process.env.ACCOUNT_COLLECTION || "accounts";

   return {
      get: function (email, encryptedPassword) {
         return db.collection(accountsCollection)
				.where("email", "==", email)
				.where("password", "==", encryptedPassword)
            .get();
      }
   }

}