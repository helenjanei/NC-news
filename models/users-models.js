const knex = require("../db/data/connection");

const selectUsername = (username) => {
  return knex
    .select("*")
    .from("users")
    .where("username", username)

    .then((user) => {
      // console.log('----> user', user)
      if (user.length === 0) {
        //console.log('in selectUsername')
        return Promise.reject({
          status: 404,
          message: "username not found"
        });
      }
      return user[0];
    });
};

module.exports = {
  selectUsername
}