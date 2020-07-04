import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {
  Permission,
  User,
  UserPermission,
  UserPermissionRelations,
} from '../models';
import {PermissionRepository} from './permission.repository';
import {UserRepository} from './user.repository';

export class UserPermissionRepository extends DefaultCrudRepository<
  UserPermission,
  typeof UserPermission.prototype.id,
  UserPermissionRelations
> {
  public readonly user: BelongsToAccessor<
    User,
    typeof UserPermission.prototype.id
  >;

  public readonly permission: BelongsToAccessor<
    Permission,
    typeof UserPermission.prototype.id
  >;

  constructor(
    @inject('datasources.Db') dataSource: DbDataSource,

    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,

    @repository.getter('PermissionRepository')
    protected permissionRepositoryGetter: Getter<PermissionRepository>,
  ) {
    super(UserPermission, dataSource);

    this.permission = this.createBelongsToAccessorFor(
      'permission',
      permissionRepositoryGetter,
    );
    this.registerInclusionResolver(
      'permission',
      this.permission.inclusionResolver,
    );

    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
