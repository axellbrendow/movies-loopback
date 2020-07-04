import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  Request,
  requestBody,
  Response,
  RestBindings
} from '@loopback/rest';
import {StorageServiceBindings} from '../keys';
import {Movie} from '../models';
import {MovieRepository, RatingRepository} from '../repositories';
import {FileUploadHandler} from '../types';
import {includeMoviesRatingSum} from '../utils/includeMoviesRatingSum';

@authenticate('jwt')
@authorize({allowedRoles: ['admin'], voters: ['authorizationProviders.basic']})
export class MovieController {
  constructor(
    @inject(StorageServiceBindings.FILE_UPLOAD_SERVICE)
    private handler: FileUploadHandler,

    @repository(MovieRepository)
    public movieRepository: MovieRepository,

    @repository(RatingRepository)
    public ratingRepository: RatingRepository,
  ) {}

  @post('/movies', {
    responses: {
      '200': {
        description: 'Movie model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Movie),
          },
        },
      },
    },
  })
  async create(
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Movie, {
            title: 'NewMovie',
          }),
        },
      },
    })
    movie: Movie,
  ): Promise<Movie> {
    return this.movieRepository.create(movie);
  }

  @post('/movies/photo', {
    responses: {
      '204': {
        description: 'Movie photo UPLOAD success',
      },
    },
  })
  async createPhoto(
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Movie, {
            title: 'NewMovie',
          }),
        },
      },
    })
    movie: Movie,
    @requestBody.file()
    request: Request,
  ) {
    console.log('REQUEST', request);
    console.log('MOVIE', movie);
    // return new Promise<Movie>((resolve, reject) => {
    //   this.handler(request, response, (err: unknown) => {
    //     if (err) reject(err);
    //     else {
    //       movie.photoPath = request.file.path;
    //       resolve(this.movieRepository.create(movie));
    //     }
    //   });
    // });
  }

  @get('/movies/count', {
    responses: {
      '200': {
        description: 'Movie model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(Movie) where?: Where<Movie>): Promise<Count> {
    return this.movieRepository.count(where);
  }

  @get('/movies', {
    responses: {
      '200': {
        description: 'Array of Movie model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Movie, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(Movie) filter?: Filter<Movie>): Promise<Movie[]> {
    const movies = await this.movieRepository.find(filter);
    const moviesIds = movies.map(movie => movie.id) as number[];
    const ratings = await this.ratingRepository.find({
      where: {movieId: {inq: moviesIds}},
    });
    return includeMoviesRatingSum(movies, ratings);
  }

  @patch('/movies', {
    responses: {
      '200': {
        description: 'Movie PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Movie, {partial: true}),
        },
      },
    })
    movie: Movie,
    @param.where(Movie) where?: Where<Movie>,
  ): Promise<Count> {
    return this.movieRepository.updateAll(movie, where);
  }

  @get('/movies/{id}', {
    responses: {
      '200': {
        description: 'Movie model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Movie, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Movie, {exclude: 'where'})
    filter?: FilterExcludingWhere<Movie>,
  ): Promise<Movie> {
    const movie = await this.movieRepository.findById(id, filter);
    const ratings = await this.movieRepository.ratings(id).find();
    return includeMoviesRatingSum([movie], ratings)[0];
  }

  @patch('/movies/{id}', {
    responses: {
      '204': {
        description: 'Movie PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Movie, {partial: true}),
        },
      },
    })
    movie: Movie,
  ): Promise<void> {
    await this.movieRepository.updateById(id, movie);
  }

  @put('/movies/{id}', {
    responses: {
      '204': {
        description: 'Movie PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() movie: Movie,
  ): Promise<void> {
    await this.movieRepository.replaceById(id, movie);
  }

  @del('/movies/{id}', {
    responses: {
      '204': {
        description: 'Movie DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.movieRepository.deleteById(id);
  }
}
