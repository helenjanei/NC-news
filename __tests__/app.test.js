process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app");
const connection = require("../db/data/connection.js");

describe("API routes", () => {
  beforeEach(() => connection.seed.run());
  afterAll(() => connection.destroy());
  test("GET 404: responds with 'path not found' for non-existent paths", () => {
    return request(app)
      .get("/yo/topics")
      .expect(404)
      .then((res) => {
        expect(res.body.message).toBe();
      });
  });
  //next test does not work - according to the docs it should, so I'm a bit lost
  test(" 405: invalid methods", () => {
    const invalidMethods = ["patch", "post", "delete"];
    const route = "/api/articles";
    const requests = invalidMethods.map((method) => {
      return request(app)[method](route)
        .expect(405)
        .then(({
          body: {
            message
          }
        }) => {
          expect(message).toBe("method not allowed");
        });
    });
    return Promise.all(requests);
  });

  describe("/topics", () => {
    test("status 200: responds with an array of topic objects", () => {
      return request(app)
        .get("/api/topics?limit=10")
        .expect(200)
        .then(({
          body
        }) => {
          expect(body.topics).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              }),
            ])
          );
        });
    })
    test("GET 200: topic objects contains a slug and description property", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((res) => {
          expect(res.body.topics).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
    });
    test("status 405: invalid methods", () => {
      const invalidMethods = ["patch", "post", "delete"];
      const requests = invalidMethods.map((method) => {
        return request(app)[method]("/api/topics")
          .expect(405)
          .then(({
            body: {
              message
            }
          }) => {
            expect(message).toBe("method not allowed");
          });
      });
      return Promise.all(requests);
    });
  });

  describe("/:username", () => {
    describe("GET", () => {
      test("GET 200: responds with the requested username object", () => {
        return request(app)
          .get("/api/users/butter_bridge")
          .expect(200)
          .then(({
            body: {
              userObject
            }
          }) => {
            expect(userObject).toEqual({
              username: "butter_bridge",
              name: "jonny",
              avatar_url: "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
            });
          });
      });
      test("GET 404: non-existent username", () => {
        return request(app)
          .get("/api/users/stealth")
          .expect(404)
          .then((response) => {
            // console.log('------>', response.body)
            expect(response.body.message).toBe("username not found");
          });
      });
    });
  });
  describe("/articles", () => {
    describe("GET", () => {
      test("GET 200: responds with an array of article objects, containing the correct properties", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then((res) => {
            expect(res.body.article).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                body: expect.any(String),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(Number),
              })
            );
          });
      });
      test("GET 200: all articles responds with an object containing the key AllArticles", () => {
        return request(app)
          .get("/api/articles?limit=12")
          .expect(200)
          .then(({
            body
          }) => {
            //console.log(body);
            expect(body).toBeObject();
            expect(body).toContainKey("allArticles");
          });
      });
      test("GET 404: responds with 'article not found' when given an article id that doesn't exist", () => {
        return request(app)
          .get("/api/articles/4000000")
          .expect(404)
          .then((res) => {
            console.log("res in test", res.body);
            expect(res.body.message).toEqual("4000000 not found");
          });
      });
      test("PATCH 200: updates number of votes on article for positive value and responds with updated article", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({
            inc_votes: 9,
          })
          .expect(200)
          .then((res) => {
            expect(res.body.article.votes).toEqual(109);
          });
      });
      test("PATCH 200: updates number of votes on article for negative value and responds with updated article", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({
            inc_votes: -8,
          })
          .expect(200)
          .then((res) => {
            expect(res.body.article.votes).toEqual(92);
          });
      });
      test("GET 200: by default, sorts the articles by the created_at column and in descending order", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({
            body: {
              allArticles
            }
          }) => {
            expect(allArticles).toBeSortedBy("created_at", {
              descending: true,
            });
          });
      });
      // test("GET 200: by sorts the articles by ascending order", () => {
      //   return request(app)
      //     .get("/api/articles?order=asc")
      //     .expect(200)
      //     .then(({
      //       body: {
      //         allArticles
      //       }
      //     }) => {
      //       expect(allArticles).toBeSortedBy({
      //         descending: false,
      //       });
      //     });
      // })
      test("GET 200: sorts the articles by any valid column passed in as a query - article_id", () => {
        return request(app)
          .get("/api/articles?sort_by=article_id")
          .expect(200)
          .then(({
            body: {
              allArticles
            }
          }) => {
            expect(allArticles).toBeSortedBy("article_id", {
              descending: true,
              coerce: true,
            });
          });
      });
      test("GET 200: sorts the articles by any valid column passed in as a query - votes", () => {
        return request(app)
          .get("/api/articles?sort_by=votes")
          .expect(200)
          .then(({
            body: {
              allArticles
            }
          }) => {
            expect(allArticles).toBeSortedBy("votes", {
              descending: true,
            });
          });
      });
      test("GET 200: sorts the articles by any valid column passed in as a query - topic", () => {
        return request(app)
          .get("/api/articles?sort_by=topic")
          .expect(200)
          .then(({
            body: {
              allArticles
            }
          }) => {
            expect(allArticles).toBeSortedBy("topic", {
              descending: true,
            });
          });
      });
      test("GET 200: sorts the articles by any valid column passed in as a query - author", () => {
        return request(app)
          .get("/api/articles?sort_by=author")
          .expect(200)
          .then(({
            body: {
              allArticles
            }
          }) => {
            expect(allArticles).toBeSortedBy("author", {
              descending: true,
            });
          });
      });

      test("GET 200: sorts the articles by any valid column passed in as a query", () => {
        return request(app)
          .get("/api/articles?sort_by=comment_count")
          .expect(200)
          .then(({
            body: {
              allArticles
            }
          }) => {
            expect(allArticles).toBeSortedBy("comment_count", {
              descending: true,
              coerce: true,
            });
          });
      });
      test("GET 400: trying to sort articles based on a non-existent column", () => {
        return request(app)
          .get("/api/articles?sort_by=not_a_column")
          .expect(400)
          .then((res) => {
            expect(res.body.message).toBe("Bad request");
          });
      });
      test("GET: 400 - order not asc or desc", () => {
        return request(app)
          .get("/api/articles?order=first_to_last")
          .expect(400)
          .then(({
            body: {
              message
            }
          }) => {
            expect(message).toBe("Bad request");
          });
      });
      test("GET 404: trying to filter articles for a non-existent author", () => {
        return request(app)
          .get("/api/articles?author=helen")
          .expect(404)
          .then(({
            body: {
              message
            }
          }) => {
            expect(message).toBe("username not found");
          });
      });
      test("GET 404: trying to filter articles for a non-existent topic", () => {
        return request(app)
          .get("/api/articles?topic=god")
          .expect(404)
          .then(({
            body: {
              message
            }
          }) => {
            expect(message).toBe("topic not found");
          });
      });
      test("GET 404: trying to filter articles for a non-existent article_id", () => {
        return request(app)
          .get("/api/articles/6543213")
          .expect(404)
          .then(({
            body: {
              message
            }
          }) => {
            expect(message).toBe("6543213 not found");
          });
      });
      test("GET 400: invalid article_id data type", () => {
        return request(app)
          .get("/api/articles/aSting")
          .expect(400)
          .then(({
            body: {
              message
            }
          }) => {
            expect(message).toBe("Bad request");
          });
      });
    });
    describe("/comments", () => {
      test("POST 201: adds a comment to an article and responds with the posted comment", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({
            username: "icellusedkars",
            body: "What a great article",
          })
          .expect(201)
          .then((res) => {
            expect(res.body.comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
              })
            );
          });
      });
      test("POST 404: responds 'article not found' when given an article id that doesn't exist", () => {
        return request(app)
          .post("/api/articles/98766/comments")
          .send({
            username: "icellusedkars",
            body: "Great post!",
          })
          .expect(404)
          .then((res) => {
            expect(res.body.message).toEqual("Article not found");
          });
      });
      test("GET 200: responds with an array of comments for the given article id with required properties", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then((res) => {
            expect(res.body.comments).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  comment_id: expect.any(Number),
                  votes: expect.any(Number),
                  created_at: expect.any(String),
                  author: expect.any(String),
                  body: expect.any(String),
                }),
              ])
            );
          });
      });
      test("GET 404: responds with 'article not found' when given an article id that doesn't exist", () => {
        return request(app)
          .get("/api/articles/98766/comments")
          .expect(404)
          .then((res) => {
            expect(res.body.message).toEqual("Article not found");
          });
      });
      test("GET 200: comments are sorted in descending order by 'created_at' set to default", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then((res) => {
            expect(res.body.comments).toBeSortedBy("created_at", {
              descending: true,
            });
          });
      });
      test("GET 200: accepts a sort_by query and sorts comments by given column", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=votes")
          .expect(200)
          .then((res) => {
            expect(res.body.comments).toBeSortedBy("votes", {
              descending: true,
            });
          });
      });
      test("GET 200: accepts an order query and sets the sort order to ascending or descending", () => {
        return request(app)
          .get("/api/articles/1/comments?order=asc")
          .expect(200)
          .then((res) => {
            expect(res.body.comments).toBeSortedBy("created_at", {
              descending: false,
            });
          });
      });
      test("PATCH 200: responds with the updated article incremented", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({
            inc_votes: 1,
          })
          .expect(200)
          .then((res) => {
            expect(res.body.article.votes).toEqual(101);
          });
      });
      test("PATCH 200: responds with the updated article decremented", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({
            inc_votes: -1,
          })
          .expect(200)
          .then((res) => {
            expect(res.body.article.votes).toEqual(99);
          });
      });
      test("PATCH 404: trying to patch a non-existent article_id", () => {
        return request(app)
          .patch("/api/articles/76666666")
          .send({
            inc_votes: 1,
          })
          .expect(404)
          .then(({
            body: {
              message
            }
          }) => {
            expect(message).toBe("article Id not found");
          });
      });
    });
    describe("DELETE", () => {
      test("DELETE 204: deletes comment from comments table by comment_id", () => {
        return request(app).del("/api/comments/1").expect(204);
      });
    });
  });
});