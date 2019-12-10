module.exports = function (app, firebaseAdmin, ajv, passport) {

   var RouteAuth = app.config.passport.routeAuth;
   var AdminOnly = app.config.passport.adminOnly;
   var AdminAndSelfOnly = app.config.passport.adminAndSelfOnly;

   var Account = app.controllers.account;
   var Rating = app.controllers.rating;
   var Login = app.controllers.login;

   // Default
   app.get('/api/', function (request, response, next) {
      response.status(200).json({
         status: 200,
         message: "Rating API"
      });
   });

   // Accounts routes
   app.post('/api/account/create', RouteAuth, AdminOnly, Account.create);
   app.get('/api/account/:accountId/get', RouteAuth, AdminAndSelfOnly, Account.get);
   app.get('/api/account/:accountId/getWithToken', RouteAuth, AdminAndSelfOnly, Account.getWithToken);
   app.delete('/api/account/:accountId/delete', RouteAuth, AdminOnly, Account.delete);
   app.post('/api/account/:accountId/update', RouteAuth, AdminOnly, Account.update);
   app.get('/api/account/list/employees', RouteAuth, AdminOnly, Account.listEmployees);
   app.get('/api/account/list/admins', RouteAuth, AdminOnly, Account.listAdmins);

   // Ratings routes
   app.post('/api/employee/:employeeId/rating/create', RouteAuth, AdminOnly, Rating.create);
   app.get('/api/employee/:employeeId/rating/:ratingId/get', RouteAuth, AdminAndSelfOnly, Rating.get);
   app.delete('/api/employee/:employeeId/rating/:ratingId/delete', RouteAuth, AdminOnly, Rating.delete);
   app.post('/api/employee/:employeeId/rating/:ratingId/update', RouteAuth, AdminOnly, Rating.update);
   app.get('/api/employee/:employeeId/rating/list/', RouteAuth, AdminAndSelfOnly, Rating.list);

   // Login routes
   app.post('/api/login', Login.login);
   app.post('/api/logout', Login.logout);
   app.post('/api/validate', Login.validate);

   // 404 Error
   app.use(function (request, response, next) {
      return response.status(404).json({
         status: 404,
         message: "Route not found"
      });
   });

}