module.exports = function (app, firebaseAdmin, ajv, passport) {

   return {
      ok: function(response, obj){
         return response.status(200).json({
            status: 200,
            message: "Complete request successfully",
            data: obj
         });
      },

      notFound: function(response, id){
         return response.status(404).json({
            status: 404,
            message: "Object not found",
            data: {
               id: id,
               message: "This object not exists",
               err: {}
            }
         });
      },

      internalServerError: function(response, err){
         return response.status(500).json({
            status: 500,
            message: "Error on execute this operation",
            data: {
               message: "Please report this error to " + app.config.info.supportEmail,
               err: err
            }
         });
      },

      badRequest: function(response, err){
         return response.status(400).json({
            status: 400,
            message: "Error on validate request",
            data: err
         });
      },

      unauthorized: function(response, err, message){
         return response.status(401).json({
            status: 401,
            message: "Unauthorized",
            data: {
               message: message,
               err: err
            }
         });
      }
   }

}