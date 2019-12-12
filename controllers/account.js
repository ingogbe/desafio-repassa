module.exports = function (app, firebaseAdmin, ajv, passport) {

   var Account = app.models.account;

   var FullValidationSchema = ajv.compile(app.validation.account.full());
   var FullLessMailValidationSchema = ajv.compile(app.validation.account.fullLessMail());
   var WithoutPasswordValidationSchema = ajv.compile(app.validation.account.withoutPassword());
   var IdValidationSchema = ajv.compile(app.validation.account.id());
   var IdsValidationSchema = ajv.compile(app.validation.account.ids());

   var sha512 = require('js-sha512').sha512;
   var secretKeygen = process.env.SECRET_KEYGEN || "secret-keygen-185161181811";

   return {
      get: function (request, response, next) {
         Account.get(request.params.accountId).then(ref => {
            if (ref.exists) {
               let obj = ref.data();
               delete obj.token;
               delete obj.password;
               obj.id = ref.id;
               return app.utils.responses.ok(response, obj);
            } 
            else {
               return app.utils.responses.notFound(response, request.params.accountId);
            }
         }).catch(err => {
            return app.utils.responses.internalServerError(response, err);
         });
      },

      getWithToken: function (request, response, next) {
         Account.get(request.params.accountId).then(ref => {
            if (ref.exists) {
               let obj = ref.data();
               obj.token = app.models.crypto.decrypt(obj.token);
               obj.id = ref.id;
               delete obj.password;
               return app.utils.responses.ok(response, obj);
            } 
            else {
               return app.utils.responses.notFound(response, request.params.accountId);
            }
         }).catch(err => {
            return app.utils.responses.internalServerError(response, err);
         });
      },

      create: function (request, response, next) {
         FullValidationSchema(request.body).then(function(data){
            data.password = app.models.crypto.encrypt(data.password);

            Account.create(data).then(ref => {
               data.id = ref.id;
               let token = sha512.hmac(secretKeygen, JSON.stringify(request.body));
               data.token = app.models.crypto.encrypt(token);
               data.ratings = 0;
               delete data.id;

               Account.update(data, ref.id).then(ref2 => {
                  data.id = ref.id;
                  data.token = token;
                  return app.utils.responses.ok(response, data);
               }).catch(err3 => {
                  return app.utils.responses.internalServerError(response, err3);
               });
            }).catch(err2 => {
               return app.utils.responses.internalServerError(response, err2);
            });
         }).catch(err => {
            return app.utils.responses.badRequest(response, err);
         });
      },

      delete: function(request, response, next){
         IdValidationSchema({id: request.params.accountId}).then(function(data){
            Account.delete(data.id).then(ref => {
               return app.utils.responses.ok(response, {
                  id: data.id
               });
            }).catch(err2 => {
               return app.utils.responses.internalServerError(response, err2);
            });
         }).catch(err => {
            return app.utils.responses.badRequest(response, err);
         });
      },

      batchDelete: function(request, response, next){
         IdsValidationSchema({ids: request.body.ids}).then(function(data){
            Account.batchDelete(data.ids).then(ref => {
               return app.utils.responses.ok(response, {
                  ids: data.ids
               });
            }).catch(err2 => {
               console.error(err2);
               return app.utils.responses.internalServerError(response, err2);
            });
         }).catch(err => {
            console.error(err);
            return app.utils.responses.badRequest(response, err);
         });
      },

      update: function(request, response, next){
         var validation = null;

         if(request.body.password === ""){
            delete request.body.password;
            validation = WithoutPasswordValidationSchema;
         }
         else{
            validation = FullLessMailValidationSchema;
         }

         validation(request.body).then(function(data){
            IdValidationSchema({id: request.params.accountId}).then(function(data2){
               if(data.password) data.password = app.models.crypto.encrypt(data.password);

               app.config.ajv.checkAttrIsFreeOrSame({
                  collection: Account.collection,
                  attr: "email",
                  id: request.params.accountId
               }, request.body.email).then(isSameFree => {
                  if(isSameFree){
                     Account.update(data, request.params.accountId).then(ref2 => {
                        Account.get(request.params.accountId).then(ref => {
                           if (ref.exists) {
                              let obj = ref.data();
                              delete obj.token;
                              delete obj.password;
                              obj.id = ref.id;
                              return app.utils.responses.ok(response, obj);
                           } 
                           else {
                              return app.utils.responses.notFound(response, request.params.accountId);
                           }
                        }).catch(err4 => {
                           return app.utils.responses.internalServerError(response, err4);
                        });
                     }).catch(err3 => {
                        return app.utils.responses.internalServerError(response, err3);
                     });
                  }
                  else{
                     return app.utils.responses.badRequest(response, {
                        message: "E-mail isnt free to use"
                     });
                  }
               }).catch(err5 => {
                  console.error(err5);
               });
            }).catch(err2 => {
               return app.utils.responses.notFound(response, request.params.accountId);
            });
         }).catch(err => {
            return app.utils.responses.badRequest(response, err);
         });
      },

      listEmployees: function(request, response, next){
         Account.listEmployees().then(ref => {
            let objs = [];
            ref.forEach(item => {
               let o = item.data();
               o.id = item.id;
               delete o.token;
               delete o.password;
               objs.push(o);
            });

            return app.utils.responses.ok(response, objs);
         }).catch(err => {
            return app.utils.responses.internalServerError(response, err);
         });
      },

      listAdmins: function(request, response, next){
         Account.listAdmins().then(ref => {
            let objs = [];
            ref.forEach(item => {
               let o = item.data();
               o.id = item.id;
               delete o.token;
               delete o.password;
               objs.push(o);
            });

            return app.utils.responses.ok(response, objs);
         }).catch(err => {
            return app.utils.responses.internalServerError(response, err);
         });
      }
   }

}