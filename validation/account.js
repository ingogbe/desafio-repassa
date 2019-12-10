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

      full: function () {
         return {
            "title": "Account Object",
            "type": "object",
            "$async": true,
            "additionalProperties": false,
            "required": ["fullname", "role"],
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
               }
            }
         }
      }
   }
}