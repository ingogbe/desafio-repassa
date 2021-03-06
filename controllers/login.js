module.exports = function (app, firebaseAdmin, ajv, passport) {

   var Login = app.models.login;

   var FullValidationSchema = ajv.compile(app.validation.login.full());

   var jwt = require('jsonwebtoken');
	var jwtSecret = process.env.JWT_SECRET || app.config.files.fallback.JWT_SECRET;
	var expirationDays = process.env.SESSION_EXPIRATION_DAYS || app.config.files.fallback.SESSION_EXPIRATION_DAYS;
	var keepExpirationDays = process.env.SESSION_KEEP_EXPIRATION_DAYS || app.config.files.fallback.SESSION_KEEP_EXPIRATION_DAYS;

   return {
      login: function(request, response, next){
			FullValidationSchema(request.body).then(function(login_data){
				login_data.password = app.models.crypto.encrypt(login_data.password);

            Login.get(login_data.email, login_data.password).then(ref => {
					if(ref.docs.length > 0){
						let data = ref.docs[0].data();
						delete data.token;
						delete data.password;
						data.id = ref.docs[0].id;

						let date = new Date();
						if(login_data.keep)
							date.setDate(date.getDate() + keepExpirationDays);
						else
							date.setDate(date.getDate() + expirationDays);

						try{
							var jwt_token = jwt.sign({ 
								fullname: data.fullname,
								id: data.id,
								expiration: date.getTime()
							}, jwtSecret, {expiresIn: login_data.keep ? '15d' : '2d'});

							return app.utils.responses.ok(response, {
								user: data,
								login_token: jwt_token
							});
						}
						catch (errToken) {
							console.log(errToken);
							return app.utils.responses.internalServerError(response, errToken);
						}
					}
					else{
						return app.utils.responses.badRequest(response, {message: "Email or Password is wrong"});
					}
            }).catch(err2 => {
               return app.utils.responses.internalServerError(response, err2);
				});
				
         }).catch(err => {
            return app.utils.responses.badRequest(response, err);
         });
		},

		logout: function(request, response, next){
			return app.utils.responses.ok(response, {message: "Logged out"});
		},

		validate: function(request, response, next){
			delete request.user.token;
			delete request.user.password;

			return app.utils.responses.ok(response, request.user);
		}
   }

}