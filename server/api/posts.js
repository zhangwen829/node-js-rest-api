const query = require('./query');

module.exports = {
  get: (req, res) => {
    const { query: { tags, sortBy, direction } } = req;

    if (!tags) {
      res.status(400).send({ error: 'Tags parameter is required' });
    } else {
      query.get(tags, sortBy, direction)
        .then(posts => {
          return res.status(200).send({ posts });
        })
        .catch(({ message }) => res.status(400).send({ error: message }));
    }
  }
};
