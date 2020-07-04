import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Permission} from './permission.model';
import {User} from './user.model';

@model()
export class UserPermission extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @belongsTo(() => User)
  userId: number;

  @belongsTo(() => Permission)
  permissionId: number;

  constructor(data?: Partial<UserPermission>) {
    super(data);
  }
}

export interface UserPermissionRelations {
  // describe navigational properties here
}

export type UserPermissionWithRelations = UserPermission &
  UserPermissionRelations;
