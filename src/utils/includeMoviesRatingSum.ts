import {Movie, Rating} from '../models';

export const includeMoviesRatingSum = (movies: Movie[], ratings: Rating[]) => {
  const moviesMap = movies.reduce<Record<string, Movie>>(
    (accumulated, movie) => {
      accumulated[String(movie.id)] = movie;
      return accumulated;
    },
    {},
  );

  const ratingPerMovie = ratings.reduce<
    Record<number, {count: number; sum: number}>
  >((accumulated, rating) => {
    if (!accumulated[rating.movieId])
      accumulated[rating.movieId] = {count: 0, sum: 0};

    accumulated[rating.movieId].count++;
    accumulated[rating.movieId].sum += rating.rating;
    return accumulated;
  }, {});

  const moviesWithRatingSum = Object.keys(ratingPerMovie).map(movieId => {
    const movie = moviesMap[movieId];
    movie.ratingsCount = ratingPerMovie[Number(movieId)].count;
    movie.ratingsSum = ratingPerMovie[Number(movieId)].sum;
    return movie;
  });

  return moviesWithRatingSum;
};
