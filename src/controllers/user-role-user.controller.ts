import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {User, UserRole} from '../models';
import {UserRoleRepository} from '../repositories';

// @authorize({allowedRoles: ['admin'], voters: [basicAuthorization]})
export class UserRoleUserController {
  constructor(
    @repository(UserRoleRepository)
    public userRoleRepository: UserRoleRepository,
  ) {}

  @get('/user-role/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to UserRole',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof UserRole.prototype.id,
  ): Promise<User> {
    return this.userRoleRepository.user(id);
  }
}
