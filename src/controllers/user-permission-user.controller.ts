import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {User, UserPermission} from '../models';
import {UserPermissionRepository} from '../repositories';

// @authorize({allowedRoles: ['admin'], voters: [basicAuthorization]})
export class UserPermissionUserController {
  constructor(
    @repository(UserPermissionRepository)
    public userPermissionRepository: UserPermissionRepository,
  ) {}

  @get('/user-permission/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to UserPermission',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof UserPermission.prototype.id,
  ): Promise<User> {
    return this.userPermissionRepository.user(id);
  }
}
