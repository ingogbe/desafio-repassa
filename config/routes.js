module.exports = function (app, firebaseAdmin, ajv, passport) {

   var allowed_origins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : app.config.files.fallback.ALLOWED_ORIGINS;
   var default_origin = process.env.DEFAULT_ORIGIN || app.config.files.fallback.DEFAULT_ORIGIN;
   /* console.log(allowed_origins); */

	//Allow all requests
	app.use(function (req, res, next) {
      var origin = req.headers.origin;

      /* console.log(origin); */

      if(allowed_origins.indexOf(origin) > -1){
         res.setHeader('Access-Control-Allow-Origin', origin);
      }
      else {
         res.setHeader('Access-Control-Allow-Origin', default_origin);
      }

      res.header('Access-Control-Allow-Credentials', true)
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
		res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

		//intercept OPTIONS method
		if ('OPTIONS' == req.method) {
			res.status(200).send("OK");
		}
		else {
			next();
		}
   });

   app.use(function (request, response, next) {
      if (process.env.UNDER_MAINTENANCE === 'true') {
         return response.status(503).send("Under Maintenance (503)");
      }
      else {
         next();
      }
   });

	return {
      
	}

}

