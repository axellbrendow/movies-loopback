import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Role} from './role.model';
import {User} from './user.model';

@model()
export class UserRole extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @belongsTo(() => User)
  userId: number;

  @belongsTo(() => Role)
  roleId: number;

  constructor(data?: Partial<UserRole>) {
    super(data);
  }
}

export interface UserRoleRelations {
  // describe navigational properties here
}

export type UserRoleWithRelations = UserRole & UserRoleRelations;
