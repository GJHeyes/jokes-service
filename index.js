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

app.post("/jokes", async (req, res) => {
  const { joke, tags } = req.body;
  const newJoke = await Joke.create({ joke, tags });
  res.json(newJoke);
});

app.delete("/jokes/:jokeId", async (req, res, next) => {
  const { jokeId } = req.params;
  try {
    Joke.destroy({
      where: {
        id: jokeId,
      },
    });
    res.send(`Joke ${jokeId} deleted`);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.put("/jokes/:jokeId", async (req, res, next) => {
  const { jokeId } = req.params;
  const { joke, tags } = req.body;
  try {
    let editJoke = await Joke.findOne({
      where: {
        id: jokeId,
      },
    });
    if (joke === undefined) {
      editJoke.tags = tags;
    } else if (tags === undefined) {
      editJoke.joke = joke;
    } else {
      editJoke.joke = joke;
      editJoke.tags = tags;
    }
    editJoke.save();
    res.send(`Joke ${jokeId} updated`);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// we export the app, not listening in here, so that we can run tests
module.exports = app;
