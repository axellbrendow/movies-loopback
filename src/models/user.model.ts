import {hasMany, model, property} from '@loopback/repository';
import {Permission} from './permission.model';
import {Rating} from './rating.model';
import {Role} from './role.model';
import {SoftDeleteEntity} from './soft-delete.entity';
import {UserPermission} from './user-permission.model';
import {UserRole} from './user-role.model';

@model({
  settings: {
    strict: false,
    forceId: false,
    hiddenProperties: ['password'],
    scope: {
      limit: 10,
      where: {deletedAt: null},
    },
    indexes: {
      uniqueEmail: {
        keys: {
          email: 1,
        },
        options: {
          unique: true,
        },
      },
    },
  },
})
export class User extends SoftDeleteEntity {
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
  firstName: string;

  @property({
    type: 'string',
  })
  lastName?: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      format: 'email',
      minLength: 5,
      transform: ['toLowerCase'],
    },
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'date',
    defaultFn: 'now',
    columnName: 'created_at',
  })
  createdAt?: string;

  @hasMany(() => Rating)
  ratings: Rating[];

  @hasMany(() => UserRole)
  userRoles: UserRole[];

  @hasMany(() => Role, {through: {model: () => UserRole}})
  roles: Role[];

  @hasMany(() => Permission, {through: {model: () => UserPermission}})
  permissions: Permission[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
