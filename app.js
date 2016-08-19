require('dotenv').config();
const compression = require('compression');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const fs = require('fs');
const reCAPTCHA = require('recaptcha2');
const registerSchema = require('./register_schema');
const registerDefaults = require('./register_defaults');
const transporter = require('./transporter');
const app = express();
app.use(compression());
const recaptcha = new reCAPTCHA({
  siteKey: process.env.SITE_KEY,
  secretKey: process.env.SECRET_KEY
});

app.listen(process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

app.use((req, res, next) => {
  res.locals.body = registerDefaults;
  next();
});

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/', (req, res, next) => {
  req.checkBody(registerSchema);
  const errors = req.validationErrors();
  recaptcha.validateRequest(req).then(() => {

    if(errors){
      res.render('index', {errors: errors, anchor: 'register', body: req.body});
    }else{
      const entry = Object.assign({}, req.body);
      delete entry['g-recaptcha-response'];
      const writeToFile = new Promise((resolve, reject) => {
        fs.readFile('./entries.json', (err, data) => {
          if (err) reject(err);
          const entries = JSON.parse(data);
          entries.push(entry);
          fs.writeFile('./entries.json', JSON.stringify(entries, null, 2), (err) => {
            if (err) reject(err);
            resolve(true);
          });
        });
      });

      const emailToGolfer = new Promise((resolve, reject) => {
        transporter.sendMail({
  //        from: 'wigwam@no-reply.com',
          to: 'brandon@mindframe.com',
          subject: 'Email To Golfer',
          html: `<b>Thank you for registering</b>`
        }, (err, info) => {
          if(err) reject(err);
          resolve(true);
        });
      });

      const emailToHost = new Promise((resolve, reject) => {
        transporter.sendMail({
    //      from: 'wigwam@no-reply.com',
          to: 'brandon@mindframe.com',
          subject: 'Email To Host',
          text: JSON.stringify(entry, null, 2)
        }, (err, info) => {
          if(err) reject(err);
          resolve(true);
        });
      });

      Promise.all([writeToFile, emailToGolfer, emailToHost]).then(success => {
        res.render('index', {success: success, anchor: 'register'});
      }).catch(err => {
        next(err);
      });
    }
  }).catch((err) => {
    errors.push({msg: 'reCAPTCHA not validated'});
    res.render('index', {errors: errors, anchor: 'register', body: req.body});
  });
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// render error page
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    errorStatus: err.status,
  });
});
