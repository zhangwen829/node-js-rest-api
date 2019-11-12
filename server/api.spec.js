const { describe, it } = require('mocha');
const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

describe('functionality of API', () => {

  it('ping request returns 200', () => chai.request(server).get('/api/ping')
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body.success).to.equal(true);
    }));


  it('gets error if no tag is specified', () => chai.request(server).get(`/api/posts`)
    .then((res) => {
      const error = 'Tags parameter is required';
      expect(res.status).to.equal(400);
      expect(res.body.error).to.equal(error);
    }));

  it('returns a list of posts when tag is specified', () => chai.request(server).get(`/api/posts?tags=tech`)
    .then((res) => {
      const { posts } = res.body;
      expect(res.status).to.equal(200);
      expect(posts).to.be.an('array');
      posts.forEach((post, index) => expect(post instanceof Object, `post[${index}] is not a Object`).to.be.true);
      posts.forEach(({ tags }) => expect(tags).to.include('tech'));
    }));

  it('by default sorts posts by id in ascending order', () => chai.request(server).get(`/api/posts?tags=tech`)
    .then((res) => {
      const { posts } = res.body;
      posts.reduce((a, b) => {
        expect(+b.id).to.be.above(+a.id);
        return b;
      }, { id: 0 });
    }));

  it('supports requests with multiple tags', () => chai.request(server).get(`/api/posts?tags=tech,health,history,culture`)
    .then((res) => {
      const { posts } = res.body;
      expect(res.status).to.equal(200);
      expect(posts).to.be.an('array');
      posts.forEach(({ tags }) => {
        const map = {};
        tags.forEach(tag => map[tag] = true); // eslint-disable-line no-return-assign
        expect(map).to.have.any.keys('tech', 'health', 'history', 'culture');
      });
    }));

  it('filters posts when multiple tags are specified', () => chai.request(server).get(`/api/posts?tags=tech,health,history,culture`)
    .then((res) => {
      const { posts } = res.body;
      posts.reduce((a, b) => {
        expect(+b.id).to.be.above(+a.id);
        return b;
      }, { id: -1 });
    }));

  it('sorting by popularity', () => chai.request(server).get(`/api/posts?tags=history,culture&sortBy=popularity`)
    .then((res) => {
      const { posts } = res.body;
      expect(res.status).to.equal(200);
      expect(posts).to.be.an('array');
      posts.reduce((a, b) => {
        expect(+b.popularity).to.be.at.least(+a.popularity);
        return b;
      }, { popularity: -1 });
    }));

  it('sorting by likes', () => chai.request(server).get(`/api/posts?tags=history,culture&sortBy=likes`)
    .then((res) => {
      const { posts } = res.body;
      expect(res.status).to.equal(200);
      posts.reduce((a, b) => {
        expect(+b.likes).to.be.at.least(+a.likes);
        return b;
      }, { likes: -1 });
    }));

  it('sorting by reads', () => chai.request(server).get(`/api/posts?tags=history,culture&sortBy=reads`)
    .then((res) => {
      const { posts } = res.body;
      expect(res.status).to.equal(200);
      posts.reduce((a, b) => {
        expect(+b.reads).to.be.at.least(+a.reads);
        return b;
      }, { reads: -1 });
    }));

  it('sorting by id', () => chai.request(server).get(`/api/posts?tags=history,culture&sortBy=id`)
    .then((res) => {
      const { posts } = res.body;
      expect(res.status).to.equal(200);
      posts.reduce((a, b) => {
        expect(+b.id).to.be.at.least(+a.id);
        return b;
      }, { id: -1 });
    }));

  it('gets error if sortBy field is not valid', () => chai.request(server).get(`/api/posts?tags=history,culture&sortBy=invalid`)
    .then((res) => {
      const error = 'sortBy parameter is invalid';
      expect(res.status).to.equal(400);
      expect(res.body.error).to.equal(error);
    }));

  it('sorting id by descending order', () => chai.request(server).get(`/api/posts?tags=history,culture&direction=desc`)
    .then((res) => {
      const { posts } = res.body;
      expect(res.status).to.equal(200);
      posts.reduce((a, b) => {
        expect(+a.id).to.be.at.least(+b.id);
        return b;
      }, { id: Infinity });
    }));

  it('sorting likes by descending order', () => chai.request(server).get(`/api/posts?tags=history,culture&sortBy=likes&direction=desc`)
    .then((res) => {
      const { posts } = res.body;
      expect(res.status).to.equal(200);
      posts.reduce((a, b) => {
        expect(+a.likes).to.be.at.least(+b.likes);
        return b;
      }, { likes: Infinity });
    }));

  it('gets error if the direction parameter is not valid', () => chai.request(server).get(`/api/posts?tags=history,culture&sortBy=likes&direction=nope`)
    .then((res) => {
      const error = 'direction parameter is invalid';
      expect(res.status).to.equal(400);
      expect(res.body.error).to.equal(error);
    }));

});
