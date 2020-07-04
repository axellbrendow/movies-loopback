import {hasMany, model, property} from '@loopback/repository';
import {RolePermission} from './role-permission.model';
import {Role} from './role.model';
import {SoftDeleteEntity} from './soft-delete.entity';

@model({settings: {strict: false, forceId: false}})
export class Permission extends SoftDeleteEntity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  slug: string;

  @property({
    type: 'date',
    defaultFn: 'now',
    columnName: 'created_at',
  })
  createdAt?: string;

  @hasMany(() => Role, {through: {model: () => RolePermission}})
  roles: Role[];

  constructor(data?: Partial<Permission>) {
    super(data);
  }
}

export interface PermissionRelations {
  // describe navigational properties here
}

export type PermissionWithRelations = Permission & PermissionRelations;
