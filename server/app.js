/* eslint-disable global-require */
var express = require('express');
var mongoose = require('mongoose');
var compression = require('compression');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var swaggerUi = require('swagger-ui-express');
const { ValidationError } = require('express-validation');
var serveStatic = require('serve-static');
var path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
const session = require('express-session');
const https = require('https');
const useragent = require('express-useragent');
var logger = require('./src/config/logger');
var errorResponse = require('./src/config/error-response');
var constants = require('./src/config/constants');
require('./src/config/environment');
require('./src/config/load-env-var');
var dbConfig = require('./src/config/db-connect');
var swaggerDoc = require('./src/resources/swagger/swagger.json');
var thirdPartySwaggerDoc = require('./src/resources/swagger/thirdPartySwagger.json');
const multer  = require('multer')
//const upload = multer({ dest: './uploads' })


 
var app = express();
app.use(express.json());
var memoryStore = new session.MemoryStore();

app.use(
  session({
    secret: 'studyapp',
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
  })
);

// get user info from 'Authorization' header and make it available throughout the session
async function validateCookies(req, res, next) {
  if (
    req.headers.authorization == '' &&
    (req.cookies.auth_token_study || req.cookies.auth_token)
  ) {
    const access_token = req.cookies.auth_token_study
      ? req.cookies.auth_token_study.access_token
      : req.cookies.auth_token.access_token;
    logger.info(
      `api router : middleware : access token from cookies  : inside if`
    );
    req.headers['authorization'] = `bearer ${access_token}`;
  }
  next();
}
app.use(cookieParser());
app.use(useragent.express());
app.use(validateCookies);


var keycloak = require('./src/config/keycloak-config.js').initKeycloak(
  memoryStore
);

app.use(keycloak.middleware());
app.use(compression());

// app.use(cors());

var whitelist = [
  
]; //add domain  to white list
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true, //Credentials are cookies, authorization headers or TLS client certificates.
  preflightContinue: false,
  // allowedHeaders: ['Content-type','Authorization','Origin','Access-Control-Allow-Origin','Accept','Options','X-Requested-With', 'userid','platform','source','session_state', 'skip'],
};

app.use(cors(corsOptions));
/*app.use(multer({
        dest: './uploads'
    }));*/
app.use(multer({dest:'../uploads/'}).single('logo'));

app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-cache');
  res.removeHeader('X-Powered-By');
  next();
});

// app.use(
//   morgan('tiny', {
//     stream: logger.stream,
//   })
// );
// app.use(express.json());
// app.use(
//   express.urlencoded({
//     extended: false,
//   })
// );
// app.use(cookieParser());
// app.use(serveStatic(path.join(__dirname, 'public', 'assets')));

var routes = require('./src/routes');

//app.post('/fs/api/fileupload', upload.single('logo'), function (req, res, next) {
 //console.log('file upload');
    // req.files is array of `photos` files
  // req.body will contain the text fields, if there were any
//})

app.use('/fs/api', routes);



if (process.env.NODE_ENV !== 'production') {
  // sample route
  app.get('/fs/', (req, res) => {
    res.json({ message: 'Welcome to FS APP.' });
  });

  // app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
  // app.use(
  //   '/api/third-party-docs',
  //   swaggerUi.serve,
  //   swaggerUi.setup(thirdPartySwaggerDoc)
  // );
}

app.get('/fs/healthcheck', (req, res) => {
  res.json({ message: 'Welcome to FS APP.' });
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(errorResponse.build(constants.error.notFound, 'Invalid URL'));
});

// error handler
app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res
      .status(err.statusCode)
      .json(errorResponse.build(constants.error.badRequest, err, err.message));
  }
  return res
    .status(err.status || constants.error.internalServerError.status)
    .json(err);
});

/*const getCA = new Promise((resolve) => {
  https.get(dbConfig.dbCA, (res) => {
    res.pipe(fs.createWriteStream('ca.crt'));
    resolve();
  });
});
const getClientCrt = new Promise((resolve) => {
  https.get(dbConfig.dbClientCRT, (res) => {
    res.pipe(fs.createWriteStream('client.crt'));
    resolve();
  });
});

const getClientPem = new Promise((resolve) => {
  https.get(dbConfig.dbClientPEM, (res) => {
    res.pipe(fs.createWriteStream('client.pem'));
    resolve();
  });
});*/

async function getkeys() {
/*  try {
    await Promise.all([getCA, getClientCrt, getClientPem]);
  } catch (error) {
    console.log('*************', error);
  }*/ 
  //commented
}

async function dbConnect() {
  try {
    if (
      !fs.existsSync('ca.crt') ||
      !fs.existsSync('client.crt') ||
      !fs.existsSync('client.pem')
    ) {
     // await getkeys(); //commented
      console.log('===================');
      console.log('Download keys for your project & Restart server Again');
      console.log('===================');
      //process.exit();
    }
    console.log("dbConfig",dbConfig)
    const dbConnectionUrl = `mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`;

    var mongoUri = dbConnectionUrl,
        mongoOpt = {
              options: {
                db: {
                  safe: true,
                },
              },
            };
 /*   const dbConnectionUrl = `mongodb://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}?ssl=true&authSource=admin`;

    var mongoUri = dbConnectionUrl,
      mongoOpt = {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        sslValidate: false,
        server: {
          sslCa: fs.readFileSync('ca.crt'),
          sslCert: fs.readFileSync('client.crt'),
          sslKey: fs.readFileSync('client.pem'),
        },
      };*/

    mongoose.connect(mongoUri, mongoOpt);
    mongoose.connection.once('open', () => {
      console.info('mongo DB SSL connection established successfully');
      mongoose.set('useUnifiedTopology', true);
      // eslint-disable-next-line global-require
      require('./src/models');
      const { datavant } = require('./src/config/cron-job');
      datavant();
    });
  } catch (error) {
    console.log('dbconnect error', error);
  }
}

dbConnect();

module.exports = app;
