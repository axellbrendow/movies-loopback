/* eslint-disable @typescript-eslint/no-explicit-any */
import {inject} from '@loopback/core';
import {
  AnyObject,
  Count,
  DataObject,
  DefaultCrudRepository,
  Filter,
  Options,
  Where,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import entities from '../db/seed/role.json';
import {Role, RoleRelations} from '../models';

type Entity = Role;
type ID = typeof Role.prototype.id;

export class RoleRepository extends DefaultCrudRepository<
  Role,
  typeof Role.prototype.id,
  RoleRelations
> {
  // public readonly rolePermission: HasManyRepositoryFactory<RolePermission, ID>;

  constructor(
    @inject('datasources.Db') dataSource: DbDataSource,

    // @repository.getter(RolePermissionRepository)
    // getRolePermissionRepository: Getter<RolePermissionRepository>,
  ) {
    super(Role, dataSource);

    // this.rolePermission = this.createHasManyRepositoryFactoryFor(
    //   'rolePermission',
    //   getRolePermissionRepository,
    // );
    // this.registerInclusionResolver(
    //   'rolePermission',
    //   this.rolePermission.inclusionResolver,
    // );
  }

  public async seed() {
    return this.createAll(entities);
  }

  find(filter?: Filter<Entity>, options?: Options): Promise<Entity[]> {
    // Filter out soft deleted entries
    filter = filter ?? {};
    filter.where = filter.where ?? {};
    (filter.where as any).deletedAt = null;

    // Now call super
    return super.find(filter, options);
  }

  findOne(
    filter?: Filter<Entity>,
    options?: AnyObject,
  ): Promise<Entity | null> {
    // Filter out soft deleted entries
    filter = filter ?? {};
    filter.where = filter.where ?? {};
    (filter.where as any).deletedAt = null;

    // Now call super
    return super.findOne(filter, options);
  }

  findById(
    id: ID,
    filter?: Filter<Entity>,
    options?: Options,
  ): Promise<Entity> {
    // Filter out soft deleted entries
    filter = filter ?? {};
    filter.where = filter.where ?? {};
    (filter.where as any).deletedAt = null;

    // Now call super
    return super.findById(id, filter, options);
  }

  updateAll(
    data: DataObject<Entity>,
    where?: Where<Entity>,
    options?: Options,
  ): Promise<Count> {
    // Filter out soft deleted entries
    where = where ?? {};
    (where as any).deletedAt = null;

    // Now call super
    return super.updateAll(data, where, options);
  }

  count(where?: Where<Entity>, options?: Options): Promise<Count> {
    // Filter out soft deleted entries
    where = where ?? {};
    (where as any).deletedAt = null;

    // Now call super
    return super.count(where, options);
  }

  delete(entity: Entity, options?: Options): Promise<void> {
    // Do soft delete, no hard delete allowed
    (entity as any).deletedAt = new Date().toISOString();
    return super.update(entity, options);
  }

  deleteAll(where?: Where<Entity>, options?: Options): Promise<Count> {
    // Do soft delete, no hard delete allowed
    return this.updateAll(
      {
        deletedAt: new Date().toISOString(),
      } as any,
      where,
      options,
    );
  }

  deleteById(id: ID, options?: Options): Promise<void> {
    // Do soft delete, no hard delete allowed
    return super.updateById(
      id,
      {
        deletedAt: new Date().toISOString(),
      } as any,
      options,
    );
  }

  /**
   * Method to perform hard delete of entries. Take caution.
   * @param entity
   * @param options
   */
  deleteHard(entity: Entity, options?: Options): Promise<void> {
    // Do hard delete
    return super.delete(entity, options);
  }

  /**
   * Method to perform hard delete of entries. Take caution.
   * @param entity
   * @param options
   */
  deleteAllHard(where?: Where<Entity>, options?: Options): Promise<Count> {
    // Do hard delete
    return super.deleteAll(where, options);
  }

  /**
   * Method to perform hard delete of entries. Take caution.
   * @param entity
   * @param options
   */
  deleteByIdHard(id: ID, options?: Options): Promise<void> {
    // Do hard delete
    return super.deleteById(id, options);
  }
}
