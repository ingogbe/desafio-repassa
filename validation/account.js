module.exports = function (app, firebaseAdmin, ajv, passport) {

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
                     "collection": process.env.ACCOUNT_COLLECTION || "accounts",
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
                     "collection": process.env.ACCOUNT_COLLECTION || "accounts",
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
                     "collection": process.env.ACCOUNT_COLLECTION || "accounts",
                     "attr": "email"
                  }
               },
               "password": {
                  "title": "Password",
                  "type": "string",
                  //minimo 8 caracteres, 1 letra minuscula, 1 numero, 1 letra maiuscula, sem caracteres especiais
                  "pattern": "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$"
               }
            }
         }
      }
   }
}