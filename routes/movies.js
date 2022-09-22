const express = require('express');
const {
  getAllSavedMovies,
  saveMovie,
  removeMovie,
} = require('../controllers/movies');
const { movieValidation, movieIdValidation } = require('../middlewares/joi');

const router = express.Router();

router.get('/', getAllSavedMovies);
router.post('/', movieValidation, saveMovie);
router.delete('/:movieId', movieIdValidation, removeMovie);

module.exports = router;
