const router = require('express').Router();
const ping = require('./ping');
const posts = require('./posts');
module.exports = router;

router.use('/ping', ping.get);
router.use('/posts', posts.get);

router.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});
