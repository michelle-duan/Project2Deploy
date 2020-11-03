const express = require("express");
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const objectId = require("mongodb").ObjectID;
require("dotenv").config();
// Connection URL
const url = process.env.MONGODB_URI || "mongodb://localhost:27017";

let db;

router.get("/list", function (request, response) {
  const tableName = "videos";
  const cursor = db.collection(tableName).find({}, { limit: 10 });
  cursor
    .map((e) => {
      return { id: e._id, name: e.name, url: e.url, thumbnail: e.thumbnail };
    })
    .toArray(function (error, result) {
      response.send(result);
    });
});

router.get("/getContent", function (request, response) {
  const tableName = "videos";
  const id = request.query.id;
  const mongoId = objectId(id);
  console.log(id);
  db.collection(tableName).findOne({ _id: mongoId }, function (error, result) {
    if (error !== undefined && error !== null) {
      // occurs error
      response.status(500);
      response.send(
        "Since server encounters error, registration failed. details: " +
          error.message
      );
    } else if (result === null) {
      response.status(400);
      console.log(id);
      response.send("Cannot find video with id " + id + ". ");
    } else {
      response.send({
        id: result._id,
        name: result.name,
        url: result.url,
        votes: result.votes,
      });
    }
  });
});

mongoClient.connect(url, { useUnifiedTopology: true }, function (
  error,
  client
) {
  assert.equal(error, null);
  db = client.db("posts");
});

router.get("/getComments", function (request, response) {
  const tableName = "comments";
  const videoId = request.query.videoId;
  const cursor = db
    .collection(tableName)
    .find({ videoId: videoId }, { limit: 10 });
  cursor
    .sort({ time: -1 })
    .map((e) => {
      return {
        id: e._id,
        userToken: e.userToken,
        comment: e.comment,
        time: e.time,
      };
    })
    .toArray(function (error, result) {
      response.send(result);
    });
});

// router.get("/getLikes", function (request, response) {
//   const tableName = "comments";
//   const videoId = request.query.videoId;
//   const cursor = db
//     .collection(tableName)
//     .find({ videoId: videoId }, { limit: 10 });
//   cursor
//     .sort({ time: -1 })
//     .map((e) => {
//       return {
//         id: e._id,
//         userToken: e.userToken,
//         comment: e.comment,
//         time: e.time,
//       };
//     })
//     .toArray(function (error, result) {
//       response.send(result);
//     });
// });

// router.get("/getComments", urlencodedParser, function (request, response) {
//   const data = request.query;
//   db.collection("comments")
//     .find({ videoId: data.videoId })
//     .toArray(function (error, result) {
//       if (error) {
//         throw error;
//       }
//       console.log("got comments");
//       response.send(result);
//     });
// });

router.post("/addComments", function (request, response) {
  const tableName = "comments";
  const data = request.body.data;
  db.collection(tableName).insertOne(
    {
      videoId: data.videoId,
      userToken: data.userToken,
      comment: data.comment,
      time: new Date(),
    },
    function (error, result) {
      if (error !== undefined && error !== null) {
        response.status(500);
        response.send(
          "Since server encounters error, add new comment failed. details: " +
            error.message
        );
      } else if (result == null) {
        response.status(400);
        response.send("Cannot find add comment for video " + data.videoId);
      } else {
        response.status(200).end();
      }
    }
  );
});

function connect(callback) {
  var MongoClient = require("mongodb").MongoClient;

  var dbURI = process.env.MONGODB_URI || require("../db/mongoDetails.js");

  var client = new MongoClient(dbURI);

  client.connect(
    function (err) {
      if (err !== null) throw err;

      var db = client.db("posts");
      var dogposts = db.collection("videos");

      callback(dogposts, client);
    },
    { useNewUrlParser: true }
  );
}

function updateVotes(c, callback) {
  console.log(c);

  connect(function (dogposts) {
    dogposts.updateOne(
      { _id: objectId(c.id) },
      { $set: { votes: c.votes } },
      function (err, result) {
        if (err !== null) throw err;
        callback(result);
      }
    );
  });
}

router.put("/updateVotes", (req, res) => {
  console.log("updateVotes in back end");

  updateVotes(
    {
      id: req.body.id,
      votes: req.body.votes,
    },
    function (result) {
      res.send(result);
    }
  );
});

// router.put("/updateVotes", (request, response) => {
//   console.log("updateVotes in back end");
//   const tableName = "videos";
//   const data = request.body.data;
//   db.collection(tableName).updateOne(
//     { _id: objectId(data.id) },
//     { $set: { votes: data.votes } },
//     function (err, result) {
//       if (err !== null) throw err;
//       response.send(result);
//       //client.close();
//     }
//   );
// });

router.put("/updateDislikes", (request, response) => {
  console.log("updateVotes in back end");
  const tableName = "videos";
  const data = request.body.data;
  db.collection(tableName).updateOne(
    { _id: objectId(data.videoId) },
    { $set: { dislikes: data.dislikes } },
    function (err, result) {
      if (err !== null) throw err;
      response.send(result);
      //client.close();
    }
  );
});

// router.post("/addComments", urlencodedParser, function (request, response) {
//   const data = request.body.data;
//   db.collection("comments").insertOne({
//     videoId: data.videoId,
//     userToken: data.userToken,
//     comment: data.comment,
//     time: new Date(),
//   }),
//     function (error) {
//       if (error) {
//         throw error;
//       }
//       response.send("comment saved");
//     };
// });

// router.get("/getComments", function (request, response) {
//   mongoClient.connect(url, function (error, client) {
//     assert.equal(error, null);
//     const db = client.db(dbName);
//     const tableName = "comments";
//     const articleId = request.query.articleId;
//     const cursor = db
//       .collection(tableName)
//       .find({ articleId: articleId }, { limit: 100 });
//     cursor
//       .sort({ time: -1 })
//       .map((e) => {
//         return {
//           id: e._id,
//           userToken: e.userToken,
//           comment: e.comment,
//         };
//       })
//       .toArray(function (error, result) {
//         client.close();
//         response.send(result);
//       });
//   });
// });

module.exports = router;
