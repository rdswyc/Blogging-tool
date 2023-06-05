/**
 * These are the routes for the reader feature
 */

const express = require('express');
const router = express.Router();

/**
 * @description retrieves the list of publised articles ordered by publication
 */
router.get('/', (req, res, next) => {
  global.db.all('SELECT id, title, created, modified, published, (Select COUNT(userSession) FROM Reaction WHERE articleId = id) as likes FROM Article;', function (err, articles) {
    if (err) {
      next(err); //send the error on to the error handler
    } else {
      res.render('author-home.ejs', { articles });
    }
  });
});

/**
 * @description displays the create page for a new article
 */
router.get('/new', (req, res) => {
  res.render('author-edit.ejs');
});

/**
 * @description create a new article
 */
router.post('/new', (req, res, next) => {
  const { title, subtitle, body } = req.body;
  global.db.run(
    'INSERT INTO Article (title, subtitle, body, created) VALUES (?, ?, ?, dateTime());',
    [title, subtitle, body],
    function (err) {
      if (err) {
        next(err); //send the error on to the error handler
      } else {
        res.redirect('/author');
        next();
      }
    }
  );
});

/**
 * @description displays the edit page for an article
 */
router.get('/edit/:id', (req, res, next) => {
  const { id } = req.params;
  global.db.get('SELECT a.id, a.title, a.subtitle, a.body, a.created, a.modified, a.published, COUNT(r.userSession) as likes FROM Article a LEFT JOIN Reaction r ON r.articleId = a.id WHERE a.id = ?;', id, function (err, article) {
    if (err) {
      next(err); //send the error on to the error handler
    } else {
      res.render('author-edit.ejs', article);
    }
  });
});

/**
 * @description edit an existing article
 */
router.post('/edit/:id', (req, res, next) => {
  const { id } = req.params;
  const { title, subtitle, body } = req.body;
  global.db.run(
    'UPDATE Article SET title = ?, subtitle = ?, body = ?, modified = DATETIME() WHERE id = ?;',
    [title, subtitle, body, id],
    function (err) {
      if (err) {
        next(err); //send the error on to the error handler
      } else {
        res.redirect('/author');
        next();
      }
    }
  );
});

/**
 * @description publish a draft article to make it available to read
 */
router.post('/publish/:articleId', (req, res, next) => {
  const { articleId } = req.params;
  global.db.run(
    'UPDATE Article SET published = DATETIME() WHERE id = ?;', articleId, function (err) {
      if (err) {
        next(err); //send the error on to the error handler
      } else {
        res.sendStatus(204);
        next();
      }
    }
  );
});

/**
 * @description delete an article from the database
 */
router.delete('/delete/:articleId', (req, res, next) => {
  const { articleId } = req.params;
  global.db.run(
    'DELETE FROM Article WHERE id = ?;', articleId, function (err) {
      if (err) {
        next(err); //send the error on to the error handler
      } else {
        res.sendStatus(204);
        next();
      }
    }
  );
});

/**
 * @description author settings page, to update blog information
 */
router.get('/settings', function (req, res) {
  res.render('author-settings.ejs', global.settings);
});

/**
 * @description update the blog settings
 */
router.post('/settings', (req, res, next) => {
  const { title, subtitle, author } = req.body;
  global.db.run(
    'UPDATE Settings SET value = CASE id WHEN "title" THEN ? WHEN "subtitle" THEN ? WHEN "author" THEN ? ELSE value END WHERE id IN ("title", "subtitle", "author");',
    [title, subtitle, author],
    function (err) {
      if (err) {
        next(err); //send the error on to the error handler
      } else {
        global.settings = { title, subtitle, author };
        res.redirect('/author');
        next();
      }
    }
  );
});

module.exports = router;
