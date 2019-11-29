const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require ('body-parser');
const Recipe = require('./models/recipe');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Content, Accept, Origin',
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS',
  );
  next();
});

app.use(bodyParser.json());

mongoose
  .connect(
    'mongodb+srv://seaman:LvKkmD6jWhfsZoX8@cluster0-mo9cb.mongodb.net/test?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  )
  .then(() => console.log('MongoDB Atlas connected successfully'))
  .catch((error) => {
    console.log('Unable to connect to mongoDB Atlas');
    console.error(error);
  });


  //the code below is a middleware to handle post requests that's coming from forms etc.  
app.post('/api/recipes', (req, res, next) => {
  const recipe = new Recipe({
    title: req.body.title,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    difficulty: req.body.difficulty,
    time: req.body.time,
  });
//using the save method of mongoose to save the model(recipe) to our database and it also returns a promise, the then method sends a response back to the frontend
  recipe.save()
    .then(() => {
      res.status(201).json({
        message: 'Recipe created successfully',
      });
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
});

//implementing our GET route, we use the  get()  method to only react to GET requests to this endpoint.
app.get('/api/recipes/:id', (req, res, next) => {
  Recipe.findOne({ _id: req.params.id })
    .then((recipe) => {
      console.log('recipe', recipe);
      res.status(200).json(recipe);
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });
});

//adding another route to our app to enable us update our recipe in database, this time, it will respond to PUT requests
app.put('/api/recipes/:id', (req, res, next) => {
  const recipe = {
    _id: req.params.id,
    title: req.body.title,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    difficulty: req.body.difficulty,
    time: req.body.time,
  };
  Recipe.updateOne({ _id: req.params.id }, recipe)
    .then(() => {
      res.status(200).json({
        message: 'Recipe updated successfully',
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
});
//Implementing the delete route to delete a recipe from our database
app.delete('/api/recipes/:id', (req, res, next) => {
  Recipe.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(204).json({
        message: 'Recipe deleted',
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
});

app.get('/api/recipes', (req, res, next) => {
  Recipe.find()
    .then((recipes) => {
      res.status(200).json(recipes);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
});

module.exports = app;
