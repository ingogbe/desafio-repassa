module.exports = function (app, firebaseAdmin, ajv, passport) {

   return {
      id: function (accountId) {
         console.log((process.env.ACCOUNT_COLLECTION || "accounts") + "/" + accountId + "/" + (process.env.RATING_COLLECTION || "ratings"));
         
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
                     "collection": (process.env.ACCOUNT_COLLECTION || "accounts") + "/" + accountId + "/" + (process.env.RATING_COLLECTION || "ratings"),
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
            "required": ["stars"],
            "properties": {
               "stars": {
                  "title": "Stars",
                  "type": "number",
                  "minimum": 1,
                  "maximum": 5
               },
               "message": {
                  "title": "Message",
                  "type": "string",
                  "minLength": 1
               }
            }
         }
      }
   }
}