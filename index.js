const express = require("express");
const app = express();
const { Joke } = require("./db");
const { Op } = require("sequelize");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/jokes", async (req, res, next) => {
  let jokes = [];
  try {
    if (req.query.tags) {
      jokes = await Joke.findAll({
        where: {
          tags: {
            [Op.like]: "%" + req.query.tags + "%",
          },
        },
      });
    } else if (req.query.content) {
      jokes = await Joke.findAll({
        where: {
          joke: {
            [Op.like]: "%" + req.query.content + "%",
          },
        },
      });
    } else {
      jokes = await Joke.findAll();
    }
    // TODO - filter the jokes by tags and content
    res.send(jokes);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// we export the app, not listening in here, so that we can run tests
module.exports = app;
