import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {Permission, RolePermission} from '../models';
import {RolePermissionRepository} from '../repositories';

// @authorize({allowedRoles: ['admin'], voters: [basicAuthorization]})
export class RolePermissionPermissionController {
  constructor(
    @repository(RolePermissionRepository)
    public rolePermissionRepository: RolePermissionRepository,
  ) {}

  @get('/role-permission/{id}/permission', {
    responses: {
      '200': {
        description: 'Permission belonging to RolePermission',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Permission)},
          },
        },
      },
    },
  })
  async getPermission(
    @param.path.number('id') id: typeof RolePermission.prototype.id,
  ): Promise<Permission> {
    return this.rolePermissionRepository.permission(id);
  }
}
