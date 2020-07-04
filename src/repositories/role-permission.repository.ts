import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {
  Permission,
  Role,
  RolePermission,
  RolePermissionRelations,
} from '../models';
import {PermissionRepository} from './permission.repository';
import {RoleRepository} from './role.repository';

export class RolePermissionRepository extends DefaultCrudRepository<
  RolePermission,
  typeof RolePermission.prototype.id,
  RolePermissionRelations
> {
  public readonly role: BelongsToAccessor<
    Role,
    typeof RolePermission.prototype.id
  >;

  public readonly permission: BelongsToAccessor<
    Permission,
    typeof RolePermission.prototype.id
  >;

  constructor(
    @inject('datasources.Db') dataSource: DbDataSource,

    @repository.getter('RoleRepository')
    protected roleRepositoryGetter: Getter<RoleRepository>,

    @repository.getter('PermissionRepository')
    protected permissionRepositoryGetter: Getter<PermissionRepository>,
  ) {
    super(RolePermission, dataSource);

    this.permission = this.createBelongsToAccessorFor(
      'permission',
      permissionRepositoryGetter,
    );
    this.registerInclusionResolver(
      'permission',
      this.permission.inclusionResolver,
    );

    this.role = this.createBelongsToAccessorFor('role', roleRepositoryGetter);
    this.registerInclusionResolver('role', this.role.inclusionResolver);
  }
}
