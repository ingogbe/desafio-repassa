module.exports = function (app, firebaseAdmin, ajv, passport) {

   return {
      full: function () {
         return {
            "title": "Login Object",
            "type": "object",
            "$async": true,
            "additionalProperties": false,
            "required": ["email", "password", "keep"],
            "properties": {
               "email": {
                  "title": "Email",
                  "type": "string",
                  "format": "email"
               },
               "password": {
                  "title": "Password",
                  "type": "string",
                  //minimo 8 caracteres, 1 letra minuscula, 1 numero, 1 letra maiuscula, sem caracteres especiais
                  "pattern": "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$"
					},
					"keep": {
						"title": "Keep login",
						"type": "boolean"
					}
            }
         }
      }
   }
}