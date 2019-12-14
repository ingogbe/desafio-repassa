module.exports = function (app, firebaseAdmin, ajv, passport) {

   //minimo 8 caracteres, 1 letra minuscula ou minuscula, 1 numero, 1 caracteres especiais
   const passwordRegex = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#\\-+=_$*()[\\]%^&])[A-Za-z\\d!@#\\-+=_$*()[\\]%^&]{8,}$";

   return {
      token: function () {
         return {
            "title": "Token",
            "type": "object",
            "$async": true,
            "additionalProperties": false,
            "required": ["token"],
            "properties": {
               "token": {
                  "title": "API Token",
                  "type": "string",
                  "minLength": 20,
                  "checkIfExists": {
                     "collection": process.env.ACCOUNT_COLLECTION || app.config.files.fallback.ACCOUNT_COLLECTION,
                     "attr": "token"
                  }
               }
            }
         }
      },

      id: function () {
         return {
            "title": "ID",
            "type": "object",
            "$async": true,
            "additionalProperties": false,
            "required": ["id"],
            "properties": {
               "id": {
                  "title": "ID",
                  "type": "string",
                  "checkIfExists": {
                     "collection": process.env.ACCOUNT_COLLECTION || app.config.files.fallback.ACCOUNT_COLLECTION,
                     "attr": "id"
                  }
               }
            }
         }
      },

      ids: function () {
         return {
            "title": "ID",
            "type": "object",
            "$async": true,
            "additionalProperties": false,
            "required": ["ids"],
            "properties": {
               "ids": {
                  "title": "ID",
                  "type": "array",
                  "items": {
                     "type": "string"
                  }
               }
            }
         }
      },

      full: function () {
         return {
            "title": "Account Object",
            "type": "object",
            "$async": true,
            "additionalProperties": false,
            "required": ["fullname", "role", "email", "password"],
            "properties": {
               "fullname": {
                  "title": "Full Name",
                  "type": "string",
                  "minLength": 10
               },
               "role": {
                  "title": "Full Name",
                  "type": "string",
                  "enum": ["admin", "employee"]
               },
               "email": {
                  "title": "Email",
                  "type": "string",
                  "format": "email",
                  "checkAttrIsFree": {
                     "collection": process.env.ACCOUNT_COLLECTION || app.config.files.fallback.ACCOUNT_COLLECTION,
                     "attr": "email"
                  }
               },
               "password": {
                  "title": "Password",
                  "type": "string",
                  "pattern": passwordRegex
               }
            }
         }
      },

      fullLessMail: function () {
         return {
            "title": "Account Object",
            "type": "object",
            "$async": true,
            "additionalProperties": false,
            "required": ["fullname", "role", "email", "password"],
            "properties": {
               "fullname": {
                  "title": "Full Name",
                  "type": "string",
                  "minLength": 10
               },
               "role": {
                  "title": "Full Name",
                  "type": "string",
                  "enum": ["admin", "employee"]
               },
               "email": {
                  "title": "Email",
                  "type": "string",
                  "format": "email"
               },
               "password": {
                  "title": "Password",
                  "type": "string",
                  "pattern": passwordRegex
               }
            }
         }
      },

      withoutPassword: function () {
         return {
            "title": "Account Object",
            "type": "object",
            "$async": true,
            "additionalProperties": false,
            "required": ["fullname", "role", "email"],
            "properties": {
               "fullname": {
                  "title": "Full Name",
                  "type": "string",
                  "minLength": 10
               },
               "role": {
                  "title": "Full Name",
                  "type": "string",
                  "enum": ["admin", "employee"]
               },
               "email": {
                  "title": "Email",
                  "type": "string",
                  "format": "email"
               }
            }
         }
      }
   }
}