var express = require('express');
var router = express.Router();
var models = require('../models');

var Page = models.Page;
var User = models.User;

router.get('/', function(req, res, next) {
  Page.findAll()
  .then(function(pages) {
  res.render('index', {pages: pages});
})


})

router.post('/', function(req, res, next) {
User.findOrCreate({
  where: {
    name: req.body.name,
    email: req.body.email
  }
})
.then(function (values) {
  var user = values[0];

  var page = Page.build({

    title: req.body.title,
    content: req.body.content
  });

  return page.save().then(function(page) {
    return page.setAuthor(user);
  });

})
.then(function(page) {
  res.redirect(page.route);
})

.catch(next);

})


router.get('/add', function(req, res, next) {
  res.render('addpage');
})

// router.get('/:urlTitle', function (req, res, next) {
//   res.send('hit dynamic route at ' + req.params.urlTitle);
// });

// router.get('/:urlTitle', function (req, res, next) {
//   var result = Page.findAll({
//   attributes: [urlTitle]
//   });

//   res.json(result);

// });

router.get('/users', function(req, res, next) {
  User.findAll({}).then(function(users){
    res.render('users', { users: users });
  }).catch(next);
});


router.get('/:urlTitle', function (req, res, next) {

  var foundPage = Page.findOne({
    where: {
      urlTitle: req.params.urlTitle
    }
  })
  .then(function(foundPage){
    res.render('wikipage', {
    title: foundPage.title,
    urlTitle: foundPage.urlTitle,
    name: foundPage.authorId,
    content: foundPage.content
    });
  })
  .catch(next);

});





module.exports = router;



