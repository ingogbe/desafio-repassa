module.exports = function (app, firebaseAdmin, ajv, passport) {

   var BearerStrategy = require('passport-http-bearer');

   var accountsCollection = process.env.ACCOUNT_COLLECTION || "accounts";

   passport.serializeUser(function (user, done) {
      done(null, user);
   });

   passport.deserializeUser(function (obj, done) {
      done(null, obj);
   });

   passport.use(new BearerStrategy(
		function(token, done) {
         let tokenEncrypted = app.models.crypto.encrypt(token);
         
         app.config.database.firestore.collection(accountsCollection).where("token", "==", tokenEncrypted).get().then(refs => {
            let data = refs.docs[0].data();
            data.id = refs.docs[0].id;
            
            return done(null, data, {
               status: 200,
               message: "Access Granted",
               data: data
            });
         }).catch(err => {
            return done(err, false, {
               status: 401,
               message: "Unauthorized",
               data: err
            });
         });
		}
	));

   return {
      bearer: {
         session: { session: false }
      },

      routeAuth: (request, response, next) => {
         passport.authenticate('bearer', app.config.passport.options, function (err, user, info) {
            if (err) {
               return app.utils.responses.unauthorized(response, err, "Invalid token");
            }
            if (!user) {
               return app.utils.responses.unauthorized(response, err, "No authorization specified");
            }
      
            request.logIn(user, function (err) {
               if (err) {
                  return app.utils.responses.unauthorized(response, err, "Unable to validate token. Please report to " + app.config.info.supportEmail);
               }
               return next();
            });
         })(request, response, next);
      },

      adminOnly: function(request, response, next){
         if(request.user.role === "admin"){
            next();
         }
         else{
            return app.utils.responses.unauthorized(response, {}, "You don't have permission");
         }
      },

      adminAndSelfOnly: function(request, response, next){
         let id = request.params.accountId || request.params.employeeId;

         if(request.user.role === "admin" || id === request.user.id){
            next();
         }
         else{
            return app.utils.responses.unauthorized(response, {}, "You don't have permission");
         }
      }

   }


}