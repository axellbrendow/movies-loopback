import {hasMany, model, property} from '@loopback/repository';
import {Permission} from './permission.model';
import {RolePermission} from './role-permission.model';
import {SoftDeleteEntity} from './soft-delete.entity';

@model({settings: {strict: false, forceId: false}})
export class Role extends SoftDeleteEntity {
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

  @hasMany(() => Permission, {through: {model: () => RolePermission}})
  permissions: Permission[];

  constructor(data?: Partial<Role>) {
    super(data);
  }
}

export interface RoleRelations {
  // describe navigational properties here
}

export type RoleWithRelations = Role & RoleRelations;
