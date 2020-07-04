import {repository} from '@loopback/repository';
import {get, getModelSchemaRef} from '@loopback/rest';
import {Movie, Rating} from '../models';
import {MovieRepository, RatingRepository} from '../repositories';
import {includeMoviesRatingSum} from '../utils/includeMoviesRatingSum';

export class MoviesReportController {
  constructor(
    @repository(MovieRepository) private movieRepository: MovieRepository,
    @repository(RatingRepository) private ratingRepository: RatingRepository,
  ) {}

  @get('/movies/reports/votes-per-movie', {
    responses: {
      '200': {
        description: 'Votes per movie',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              additionalProperties: {
                type: 'array',
                items: getModelSchemaRef(Rating),
              },
            },
          },
        },
      },
    },
  })
  async votesPerMovie() {
    const ratings = await this.ratingRepository.find();

    const ratingsPerMovie = ratings.reduce<Record<number, Rating[]>>(
      (accumulated, rating) => {
        if (!accumulated[rating.movieId]) accumulated[rating.movieId] = [];

        accumulated[rating.movieId].push(rating);
        return accumulated;
      },
      {},
    );

    return ratingsPerMovie;
  }

  @get('/movies/reports/best-ratings', {
    responses: {
      '200': {
        description: 'Ten best rating movies',
        content: {
          'application/json': {
            schema: {type: 'array', items: {type: getModelSchemaRef(Movie)}},
          },
        },
      },
    },
  })
  async tenBestRatingMovies() {
    const ratings = await this.ratingRepository.find();
    const movies = await this.movieRepository.find();
    const moviesWithRatingSum = includeMoviesRatingSum(movies, ratings);

    moviesWithRatingSum.sort(
      (movie0, movie1) =>
        (movie1.ratingsSum as number) - (movie0.ratingsSum as number),
    );

    return moviesWithRatingSum.slice(0, 10);
  }
}
