module.exports = function (app, firebaseAdmin, ajv, passport) {

   return {
      id: function (accountId) {
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
                     "collection": (process.env.ACCOUNT_COLLECTION || app.config.files.fallback.ACCOUNT_COLLECTION) + "/" + accountId + "/" + (process.env.RATING_COLLECTION || app.config.files.fallback.RATING_COLLECTION),
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