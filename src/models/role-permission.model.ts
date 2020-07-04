import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Permission} from './permission.model';
import {Role} from './role.model';

@model()
export class RolePermission extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @belongsTo(() => Role)
  roleId: number;

  @belongsTo(() => Permission)
  permissionId: number;

  constructor(data?: Partial<RolePermission>) {
    super(data);
  }
}

export interface RolePermissionRelations {
  // describe navigational properties here
}

export type RolePermissionWithRelations = RolePermission &
  RolePermissionRelations;
