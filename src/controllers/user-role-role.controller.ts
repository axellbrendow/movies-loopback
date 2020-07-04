import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {Role, UserRole} from '../models';
import {UserRoleRepository} from '../repositories';

// @authorize({allowedRoles: ['admin'], voters: [basicAuthorization]})
export class UserRoleRoleController {
  constructor(
    @repository(UserRoleRepository)
    public userRoleRepository: UserRoleRepository,
  ) {}

  @get('/user-role/{id}/role', {
    responses: {
      '200': {
        description: 'Role belonging to UserRole',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Role)},
          },
        },
      },
    },
  })
  async getRole(
    @param.path.number('id') id: typeof UserRole.prototype.id,
  ): Promise<Role> {
    return this.userRoleRepository.role(id);
  }
}
