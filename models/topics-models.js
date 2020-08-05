const knex = require('../db/data/connection.js');

selectTopics = (topic) => {
  return knex
    .select("*")
    .from("topics")
    .modify((query) => {
      if (topic) query.where("slug", topic);
    })
    .then((topic) => {
      if (topic.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "topic not found"
        });
      }

      return topic[0];

    });
};

module.exports = {
  selectTopics
}
// an array of topic objects, each of which should have the following properties:
//   slug
// description