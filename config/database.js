module.exports = function (app, firebaseAdmin, ajv, passport) {

   firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(app.config.files["desafio-repassa-firebase-adminsdk-v4jth-61f79bfb8c"]),
      databaseURL: "https://desafio-repassa.firebaseio.com"
   });


   var firestore = firebaseAdmin.firestore();

   const settings = {
      timestampsInSnapshots: true
   };

   firestore.settings(settings);

   return {
      firestore: firestore,
      firestoreRaw: firebaseAdmin.firestore
   }

}