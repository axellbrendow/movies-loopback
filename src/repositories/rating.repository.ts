import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import entities from '../db/seed/rating.json';
import {Rating, RatingRelations} from '../models';

export class RatingRepository extends DefaultCrudRepository<
  Rating,
  typeof Rating.prototype.id,
  RatingRelations
> {
  // public readonly movie: BelongsToAccessor<Movie, typeof Rating.prototype.id>;

  // public readonly user: BelongsToAccessor<User, typeof Rating.prototype.id>;

  constructor(
    @inject('datasources.Db') dataSource: DbDataSource,

    // @repository.getter(MovieRepository)
    // movieRepositoryGetter: Getter<MovieRepository>,

    // @repository.getter(UserRepository)
    // userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Rating, dataSource);

    // this.movie = this.createBelongsToAccessorFor(
    //   'movie',
    //   movieRepositoryGetter,
    // );
    // this.registerInclusionResolver('movie', this.movie.inclusionResolver);

    // this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
    // this.registerInclusionResolver('user', this.user.inclusionResolver);
  }

  public async seed() {
    return this.createAll(entities);
  }
}
