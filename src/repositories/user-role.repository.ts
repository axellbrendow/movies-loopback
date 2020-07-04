import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import entities from '../db/seed/userRole.json';
import {Role, User, UserRole, UserRoleRelations} from '../models';
import {RoleRepository} from './role.repository';
import {UserRepository} from './user.repository';

export class UserRoleRepository extends DefaultCrudRepository<
  UserRole,
  typeof UserRole.prototype.id,
  UserRoleRelations
> {
  public readonly user: BelongsToAccessor<User, typeof UserRole.prototype.id>;

  public readonly role: BelongsToAccessor<Role, typeof UserRole.prototype.id>;

  constructor(
    @inject('datasources.Db') dataSource: DbDataSource,

    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,

    @repository.getter('RoleRepository')
    protected roleRepositoryGetter: Getter<RoleRepository>,
  ) {
    super(UserRole, dataSource);

    this.role = this.createBelongsToAccessorFor('role', roleRepositoryGetter);
    this.registerInclusionResolver('role', this.role.inclusionResolver);

    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }

  public async seed() {
    return this.createAll(entities);
  }
}
