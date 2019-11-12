const axios = require('axios');

// all posts in one array
const concat = data => data.reduce(
  (accum, { data: { posts } }) => accum.concat(posts),
  [],
);

// no duplicated posts
const filter = (posts) => {
  const map = {};
  const res = [];
  posts.forEach((post) => {
    const { id } = post;
    if (!map[id]) {
      res.push(post);
    }

    map[id] = true;
  });
  return res;
};

const sort = (data, sortBy, direction) => data.sort((a, b) => {
  return direction === 'asc' ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy];
});

const validate = (data, sortBy, direction) => {
  const validFields = ['id', 'reads', 'likes', 'popularity'];
  if (!validFields.includes(sortBy)) {
    return Promise.reject(new Error('sortBy parameter is invalid'));
  }
  if (direction !== 'asc' && direction !== 'desc') {
    return Promise.reject(new Error('direction parameter is invalid'));
  }
  return sort(data, sortBy, direction);
};

module.exports = {
  get: (tags, sortBy = 'id', direction = 'asc') => {
    const tagsArr = tags.split(',');
    const promises = [];
    const url = 'INSERT URL HERE';

    tagsArr.forEach((tag) => {
      promises.push(
        axios.get(`${url}?tag=${tag}`),
      );
    });

    return Promise.all(promises)
      .then(
        posts => concat(posts)
      ).then(
        posts => filter(posts)
      ).then(
        posts => validate(posts, sortBy, direction)
      );
  },
};
