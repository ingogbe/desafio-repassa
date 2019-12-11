module.exports = function (app, firebaseAdmin, ajv, passport) {

   var Rating = app.models.rating;

   var FullValidationSchema = ajv.compile(app.validation.rating.full());
   var IdAccountValidationSchema = ajv.compile(app.validation.account.id());

   return {
      get: function (request, response, next) {
         IdAccountValidationSchema({id: request.params.employeeId}).then(function(data2){
            Rating.get(request.params.employeeId, request.params.ratingId).then(ref => {
               if (ref.exists) {
                  let obj = ref.data();
                  obj.id = ref.id;
                  return app.utils.responses.ok(response, obj);
               } 
               else {
                  return app.utils.responses.notFound(response, request.params.ratingId);
               }
            }).catch(err => {
               return app.utils.responses.internalServerError(response, err);
            });
         }).catch(errAccount => {
            return app.utils.responses.notFound(response, request.params.employeeId);
         });
      },

      create: function (request, response, next) {
         IdAccountValidationSchema({id: request.params.employeeId}).then(function(data2){
            FullValidationSchema(request.body).then(function(data){
               data.from = request.user.fullname;

               Rating.create(request.params.employeeId, data).then(ref => {
                  data.id = ref.id;
                  return app.utils.responses.ok(response, data);
               }).catch(err3 => {
                  return app.utils.responses.internalServerError(response, err3);
               });
            }).catch(err => {
               return app.utils.responses.badRequest(response, err);
            });
         }).catch(errAccount => {
            return app.utils.responses.notFound(response, request.params.employeeId);
         });
      },

      delete: function(request, response, next){
         IdAccountValidationSchema({id: request.params.employeeId}).then(function(accountId){

            var IdValidationSchema = ajv.compile(app.validation.rating.id(request.params.employeeId));

            IdValidationSchema({id: request.params.ratingId}).then(function(data){
               Rating.delete(request.params.employeeId, request.params.ratingId).then(ref => {
                  return app.utils.responses.ok(response, {
                     id: request.params.ratingId
                  });
               }).catch(err3 => {
                  return app.utils.responses.internalServerError(response, err3);
               });
            }).catch(err2 => {
               return app.utils.responses.notFound(response, request.params.ratingId);
            });
         }).catch(errAccount => {
            return app.utils.responses.notFound(response, request.params.employeeId);
         });
      },

      update: function(request, response, next){
         IdAccountValidationSchema({id: request.params.employeeId}).then(function(accountId){
            FullValidationSchema(request.body).then(function(data){

               var IdValidationSchema = ajv.compile(app.validation.rating.id(request.params.employeeId));

               IdValidationSchema({id: request.params.ratingId}).then(function(data2){
                  Rating.update(request.params.employeeId, request.params.ratingId, data).then(ref => {
                     data.id = request.params.ratingId;
                     return app.utils.responses.ok(response, data);
                  }).catch(err3 => {
                     return app.utils.responses.internalServerError(response, err3);
                  });
               }).catch(err2 => {
                  return app.utils.responses.notFound(response, request.params.ratingId);
               });
            }).catch(err => {
               return app.utils.responses.badRequest(response, err);
            });
         }).catch(errAccount => {
            return app.utils.responses.notFound(response, request.params.employeeId);
         });
      },

      list: function(request, response, next){
         IdAccountValidationSchema({id: request.params.employeeId}).then(function(data2){
            Rating.list(request.params.employeeId).then(ref => {
               let objs = [];
               ref.forEach(item => {
                  let o = item.data();
                  o.id = item.id;
                  objs.push(o);
               });
   
               return app.utils.responses.ok(response, objs);
            }).catch(err => {
               return app.utils.responses.internalServerError(response, err);
            });
         }).catch(errAccount => {
            return app.utils.responses.notFound(response, request.params.employeeId);
         });
      }
   }

}