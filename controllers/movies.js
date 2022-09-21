const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getAllSavedMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.saveMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(
          new BadRequestError('Некорректные данные при сохранении фильма'),
        );
      }
      return next(err);
    });
};

module.exports.removeMovie = (req, res, next) => {
  const id = req.params.movieId;
  Movie.findById(id)
    .orFail(new NotFoundError('Фильм не найден'))
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        return next(new ForbiddenError('Вы не можете удалить чужой фильм'));
      }
      return Movie.findByIdAndRemove(id).then((removedFilm) =>
        res.send(removedFilm),
      );
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Неверный идентификатор фильм'));
      } else {
        next(err);
      }
    });
};
