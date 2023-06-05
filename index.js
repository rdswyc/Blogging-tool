const express = require('express');
const app = express();
const port = 3000;
const sqlite3 = require('sqlite3').verbose();

// items in the global namespace are accessible throught out the node application
global.db = new sqlite3.Database('./database.db', function (err) {
  if (err) {
    console.error(err);
    process.exit(1); //Bail out we can't connect to the DB
  } else {
    console.log('Database connected');
    global.db.run('PRAGMA foreign_keys=ON'); //This tells SQLite to pay attention to foreign key constraints
  }
});

// set the user session for reactions management
global.userSession = require('crypto').randomUUID();

// get the settings of the app in the global variable as an object
global.db.all('SELECT * FROM Settings', function (err, rows) {
  if (err) {
    next(err);
  } else {
    global.settings = rows.reduce((prev, curr) => ({ ...prev, [curr.id]: curr.value }), {});
  }
});

// configure body parser to be able to receive the request body
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// set the app to use ejs for rendering
app.set('view engine', 'ejs');

// use static files on the assets folder for bootstrap
app.use('/assets', express.static('public'));

// add the author routes to the app under the path /author
const authorRoutes = require('./routes/author');
app.use('/author', authorRoutes);

// add the reader routes to the app under the path /
const readerRoutes = require('./routes/reader');
app.use('/', readerRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
