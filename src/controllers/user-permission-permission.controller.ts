import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {Permission, UserPermission} from '../models';
import {UserPermissionRepository} from '../repositories';

// @authorize({allowedRoles: ['admin'], voters: [basicAuthorization]})
export class UserPermissionPermissionController {
  constructor(
    @repository(UserPermissionRepository)
    public userPermissionRepository: UserPermissionRepository,
  ) {}

  @get('/user-permission/{id}/permission', {
    responses: {
      '200': {
        description: 'Permission belonging to UserPermission',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Permission)},
          },
        },
      },
    },
  })
  async getPermission(
    @param.path.number('id') id: typeof UserPermission.prototype.id,
  ): Promise<Permission> {
    return this.userPermissionRepository.permission(id);
  }
}
