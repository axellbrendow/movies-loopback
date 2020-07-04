import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {Role, RolePermission} from '../models';
import {RolePermissionRepository} from '../repositories';

// @authorize({allowedRoles: ['admin'], voters: [basicAuthorization]})
export class RolePermissionRoleController {
  constructor(
    @repository(RolePermissionRepository)
    public rolePermissionRepository: RolePermissionRepository,
  ) {}

  @get('/role-permission/{id}/role', {
    responses: {
      '200': {
        description: 'Role belonging to RolePermission',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Role)},
          },
        },
      },
    },
  })
  async getRole(
    @param.path.number('id') id: typeof RolePermission.prototype.id,
  ): Promise<Role> {
    return this.rolePermissionRepository.role(id);
  }
}
