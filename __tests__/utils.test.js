const {
  formatDates,
  makeRefObj,
  formatComments,
} = require('../db/utils/utils');

describe('formatDates', () => {
  test("returns an empty array when passed an empty array", () => {
    expect(formatDates([])).toEqual([]);
  });
  test("returns a new array", () => {
    const input = [];
    expect(formatDates(input)).not.toBe(input)
  });
  test("reformats the date", () => {
    const input = [{
      title: 'Game of talents: management lessons from top football coaches',
      topic: 'football',
      author: 'jessjelly',
      body: 'At lunchtime on the day of the Champions League final in 2012, Chelsea’s manager Roberto Di Matteo had selected 10 of his 11',
      created_at: 1491044088304,
    }, ]
    const formattedInput = formatDates(input)
    expect(formattedInput[0].created_at).toEqual(new Date(input[0].created_at));
  })
  test("it does not mutate the original input testing actual data", () => {
    const input = [{
      title: 'Game of talents: management lessons from top football coaches',
      topic: 'football',
      author: 'jessjelly',
      body: 'At lunchtime on the day of the Champions League final in 2012, Chelsea’s manager Roberto Di Matteo had selected 10 of his 11',
      created_at: 1491044088304,
    }, ]
    formatDates(input);
    expect(input).toEqual([{
      title: 'Game of talents: management lessons from top football coaches',
      topic: 'football',
      author: 'jessjelly',
      body: 'At lunchtime on the day of the Champions League final in 2012, Chelsea’s manager Roberto Di Matteo had selected 10 of his 11',
      created_at: 1491044088304,
    }, ]);
    //test('multiple objects in the array')
  });
});

describe('makeRefObj', () => {
  test('returns an empty object when passed an empty array', () => {
    const list = []
    const actual = makeRefObj(list);
    const expected = {};
    expect(actual).toEqual(expected);
  })
  test('creates a reference object', () => {
    const list = [{
      article_id: 1,
      title: 'A'
    }]
    expect(makeRefObj(list, 'title', 'article_id')).toEqual({
      A: 1
    })
  })
  test('it does not mutate the original input', () => {
    const list = []
    makeRefObj(list, "article_id", "title");
    expect(list).toEqual([]);
  })
});

describe('formatComments', () => {
  test("returns an empty array when passed an empty array", () => {
    expect(formatComments([])).toEqual([]);
  });
  test("returns a new array", () => {
    const input = [];
    expect(formatComments(input)).not.toBe(input);
  });
  test("it does not mutate the original input testing an empty array", () => {
    const input = [];
    formatComments(input);
    expect(input).toEqual([]);
  });
  test("returns a new empty array, when passed an empty array", () => {
    const comments = [];
    const articleRef = {};
    const actual = formatComments(comments, articleRef);
    const expected = [];
    expect(actual).toEqual(expected);
    expect(actual).not.toBe(comments);
  });
  test("it does not mutate the original comments and articleRef input", () => {
    const comments = [{
      body: 'Ambidextrous marsupial',
      belongs_to: 'Living in the shadow of a great man',
      created_by: 'icellusedkars',
      votes: 0,
      created_at: 1195994163389,
    }, ];
    const articleRef = {
      A: 1,
    };
    formatComments(comments, articleRef);
    expect(comments).toEqual([{
      body: 'Ambidextrous marsupial',
      belongs_to: 'Living in the shadow of a great man',
      created_by: 'icellusedkars',
      votes: 0,
      created_at: 1195994163389,
    }, ]);
    expect(articleRef).toEqual({
      A: 1,
    });
  });
  test("it changes certain keys in each object within the comments array and references the lookup object", () => {
    const comments = [{
      body: 'Ambidextrous marsupial',
      belongs_to: 'Living in the shadow of a great man',
      created_by: 'icellusedkars',
      votes: 0,
      created_at: 1195994163389,
    }, ];
    const articleRef = {
      "Living in the shadow of a great man": 1,
    };

    expect(formatComments(comments, articleRef)).toEqual([{
      body: 'Ambidextrous marsupial',
      votes: 0,
      created_at: new Date(1195994163389),
      article_id: 1,
      author: 'icellusedkars',
    }, ]);
  });
});