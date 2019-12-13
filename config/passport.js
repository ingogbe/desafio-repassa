module.exports = function (app, firebaseAdmin, ajv, passport) {

   var BearerStrategy = require('passport-http-bearer');
   var JwtStrategy = require('passport-jwt').Strategy;
   var ExtractJwt = require('passport-jwt').ExtractJwt;

   var jwt = require('jsonwebtoken');

   var jwtSecret = process.env.JWT_SECRET || app.config.files.fallback.JWT_SECRET;
   var accountsCollection = process.env.ACCOUNT_COLLECTION || app.config.files.fallback.ACCOUNT_COLLECTION;

   var opts = {};
   opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
   opts.secretOrKey = jwtSecret;

   passport.serializeUser(function (user, done) {
      done(null, user);
   });

   passport.deserializeUser(function (obj, done) {
      done(null, obj);
   });

   passport.use(new BearerStrategy(
      function (token, done) {

         let tokenEncrypted = app.models.crypto.encrypt(token);

         app.config.database.firestore.collection(accountsCollection).where("token", "==", tokenEncrypted).get().then(refs => {
            if (refs.docs.length > 0) {
               let data = refs.docs[0].data();
               data.id = refs.docs[0].id;

               return done(null, data, {
                  status: 200,
                  message: "Access Granted",
                  data: data
               });
            }
            else {
               return done("Token invalid", false, {
                  status: 401,
                  message: "Unauthorized",
                  data: {}
               });
            }
         }).catch(err => {
            return done(err, false, {
               status: 401,
               message: "Unauthorized",
               data: err
            });
         });
      }
   ));

   passport.use(new JwtStrategy(opts, function (jwt_payload, done) {

      if (jwt_payload.expiration) {
         if (jwt_payload.expiration <= new Date().getTime()) {
            return done("Token expired", false, {
               status: 401,
               message: "Unauthorized",
               data: {}
            });
         }
         else {
            app.models.account.get(jwt_payload.id).then(ref => {
               if (ref.exists) {
                  let obj = ref.data();
                  obj.id = ref.id;
                  return done(null, obj, {
                     status: 200,
                     message: "Access Granted",
                     data: obj
                  });
               } else {
                  return done("Token invalid", false, {
                     status: 401,
                     message: "Unauthorized",
                     data: {}
                  });
               }
            }).catch(err => {
               return done(err, false, {
                  status: 401,
                  message: "Unauthorized",
                  data: err
               });
            });
         }
      }
      else {
         return done("Token expired", false, {
            status: 401,
            message: "Unauthorized",
            data: {}
         });
      }
   }));

   return {
      options: {
         session: false
      },

      verify: (request, response, next) => {
         if(request.headers.authorization){
            let token = request.headers.authorization.split(" ");
   
            if(token[1]){
               try {
                  var decoded = jwt.verify(token[1], jwtSecret);
                  console.log("Decoded:", decoded);
               } catch (err) {
                  console.error(err);
               }
            }
         }

         next();
      },

      routeAuth: (request, response, next) => {
         passport.authenticate(['jwt', 'bearer'], app.config.passport.options, function (err, user, info) {
            if (err || !user) {
               return app.utils.responses.unauthorized(response, err, "Invalid token");
            }

            request.logIn(user, function (err) {
               if (err) {
                  return app.utils.responses.unauthorized(response, err, "Unable to validate token. Please report to " + app.config.info.supportEmail);
               }
               return next();
            });
         })(request, response, next);
      },

      adminOnly: function (request, response, next) {
         if (request.user.role === "admin") {
            next();
         } else {
            return app.utils.responses.unauthorized(response, {}, "You don't have permission");
         }
      },

      adminAndSelfOnly: function (request, response, next) {
         let id = request.params.accountId || request.params.employeeId;

         if (request.user.role === "admin" || id === request.user.id) {
            next();
         } else {
            return app.utils.responses.unauthorized(response, {}, "You don't have permission");
         }
      }

   }


}