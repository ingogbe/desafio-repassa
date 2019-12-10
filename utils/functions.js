module.exports = function (app, firebaseAdmin, ajv, passport) {

   return {
      randomIntFromInterval: function (min, max) {
         return Math.floor(Math.random() * (max - min + 1) + min);
      },

      isEmptyJSON: function (obj) {
         for (var prop in obj) {
             if (obj.hasOwnProperty(prop))
                 return false;
         }

         return JSON.stringify(obj) === JSON.stringify({});
     },

      toLowerCaseJSON: function (obj) {
         for (var prop in obj) {
            if (typeof obj[prop] === "object") {
               app.controllers.tests.toLowerCaseJSON(obj[prop]);
            }
            else if (typeof obj[prop] === "string") {
               obj[prop] = obj[prop].toLowerCase();
            }
            else {
               //Other type
            }
         }

         return obj;
      },

      getTodayDate: function () {
         var today = new Date();
         var stringDate = today.getFullYear() + '-';

         if ((today.getMonth() + 1) <= 9) {
            stringDate += '0' + (today.getMonth() + 1) + '-';
         }
         else {
            stringDate += (today.getMonth() + 1) + '-';
         }

         if (today.getDate() <= 9) {
            stringDate += '0' + today.getDate();
         }
         else {
            stringDate += today.getDate();
         }

         return stringDate;
      },

      mergeObjects: function (obj1, obj2) {
         for (var prop in obj2) {
            obj1[prop] = obj2[prop];
         }

         return obj1;
      },

      isEven: function (n) {
         return n % 2 == 0;
      },

      isOdd: function (n) {
         return Math.abs(n % 2) == 1;
      },

      clone: function(obj) {
         var copy;
     
         // Handle the 3 simple types, and null or undefined
         if (null == obj || "object" != typeof obj) return obj;
     
         // Handle Date
         if (obj instanceof Date) {
             copy = new Date();
             copy.setTime(obj.getTime());
             return copy;
         }
     
         // Handle Array
         if (obj instanceof Array) {
             copy = [];
             for (var i = 0, len = obj.length; i < len; i++) {
                 copy[i] = app.utils.functions.clone(obj[i]);
             }
             return copy;
         }
     
         // Handle Object
         if (obj instanceof Object) {
             copy = {};
             for (var attr in obj) {
                 if (obj.hasOwnProperty(attr)) copy[attr] = app.utils.functions.clone(obj[attr]);
             }
             return copy;
         }
     
         throw new Error("Unable to copy obj! Its type isn't supported.");
     }
   }

}