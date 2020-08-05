const {
  reduce
} = require("../data/development-data/comments");

exports.formatDates = list => {
  return list.map(list => {
    const listCopy = {
      ...list
    };
    listCopy.created_at = new Date(listCopy.created_at);
    return listCopy;
  });
};

exports.makeRefObj = (list, key, prop) => {
  let refObj = {};
  list.forEach((article) => {
    refObj[article[key]] = article[prop]
  })
  return refObj

};

exports.formatComments = (comments, articleRef) => {
  return comments.map((comment) => {
    const newObj = {
      ...comment
    };

    newObj.article_id = articleRef[comment.belongs_to];
    delete newObj.belongs_to;
    newObj.created_at = new Date(newObj.created_at);
    newObj.author = newObj.created_by;
    delete newObj.created_by;
    return newObj;
  });
};