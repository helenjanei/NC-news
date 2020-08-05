process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app");
const connection = require("../db/data/connection.js");

describe("API routes", () => {
  beforeEach(() => connection.seed.run());
  afterAll(() => connection.destroy());
  // test("GET 404: responds with 'path not found' for non-existent paths", () => {
  //   return request(app)
  //     .get("/yo/topics")
  //     .expect(404)
  //     .then((res) => {
  //       expect(res.body.msg).toBe();
  //     });
  // });
  describe("/topics", () => {
    test("status 200: topic objects contains a slug and description property", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((res) => {
          expect(res.body.topics).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              }),
            ])
          );
        });
    });
    describe("/:username", () => {
      describe("GET", () => {
        test("status 200: responds with the requested username object", () => {
          return request(app)
            .get("/api/users/butter_bridge")
            .expect(200)
            .then(({
              body: {
                userObject
              }
            }) => {
              expect(userObject).toEqual({
                username: 'butter_bridge',
                name: 'jonny',
                avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',

              });
            });
        });
        test("status 404: non-existent username", () => {
          return request(app)
            .get("/api/users/stealth")
            .expect(404)
            .then((response) => {
              console.log('------>', response.body)
              expect(response.body.message).toBe("username not found");
            });
        });
      });
    });
    describe("/articles", () => {
      describe("GET", () => {
        test('status 200: responds with an array of article objects, containing certain properties', () => {
          return request(app)
            .get('/api/articles/1')
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
        })
        test("GET 404: responds with 'article not found' when given an article id that doesn't exist", () => {
          return request(app)
            .get("/api/articles/4000000")
            .expect(404)
            .then((res) => {
              expect(res.body.msg).toEqual("4000000 not found");
            });
        })
        test("PATCH 200: updates number of votes on article for positive value and responds with updated article", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({
              inc_votes: 9
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
              inc_votes: -8
            })
            .expect(200)
            .then((res) => {
              expect(res.body.article.votes).toEqual(92);
            });
        });
      })
    })

  })
});