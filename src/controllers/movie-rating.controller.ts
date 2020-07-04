import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {Movie, Rating} from '../models';
import {MovieRepository} from '../repositories';

export class MovieRatingController {
  constructor(
    @repository(MovieRepository) protected movieRepository: MovieRepository,
  ) {}

  @get('/movies/{id}/ratings', {
    responses: {
      '200': {
        description: 'Array of Movie has many Rating',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Rating)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Rating>,
  ): Promise<Rating[]> {
    return this.movieRepository.ratings(id).find(filter);
  }

  @post('/movies/{id}/ratings', {
    responses: {
      '200': {
        description: 'Movie model instance',
        content: {'application/json': {schema: getModelSchemaRef(Rating)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Movie.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Rating, {
            title: 'NewRatingInMovie',
            exclude: ['id'],
            optional: ['movieId'],
          }),
        },
      },
    })
    rating: Omit<Rating, 'id'>,
  ): Promise<Rating> {
    return this.movieRepository.ratings(id).create(rating);
  }

  @patch('/movies/{id}/ratings', {
    responses: {
      '200': {
        description: 'Movie.Rating PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Rating, {partial: true}),
        },
      },
    })
    rating: Partial<Rating>,
    @param.query.object('where', getWhereSchemaFor(Rating))
    where?: Where<Rating>,
  ): Promise<Count> {
    return this.movieRepository.ratings(id).patch(rating, where);
  }

  @del('/movies/{id}/ratings', {
    responses: {
      '200': {
        description: 'Movie.Rating DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Rating))
    where?: Where<Rating>,
  ): Promise<Count> {
    return this.movieRepository.ratings(id).delete(where);
  }
}
