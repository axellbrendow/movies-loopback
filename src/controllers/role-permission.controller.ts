import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
} from '@loopback/rest';
import {RolePermission} from '../models';
import {RolePermissionRepository} from '../repositories';

// @authorize({allowedRoles: ['admin'], voters: [basicAuthorization]})
export class RolePermissionController {
  constructor(
    @repository(RolePermissionRepository)
    public rolePermissionRepository: RolePermissionRepository,
  ) {}

  @post('/role-permission', {
    responses: {
      '200': {
        description: 'RolePermission model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(RolePermission)},
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RolePermission, {
            title: 'NewRolePermission',
            exclude: ['id'],
          }),
        },
      },
    })
    rolePermission: Omit<RolePermission, 'id'>,
  ): Promise<RolePermission> {
    return this.rolePermissionRepository.create(rolePermission);
  }

  @get('/role-permission/count', {
    responses: {
      '200': {
        description: 'RolePermission model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(RolePermission) where?: Where<RolePermission>,
  ): Promise<Count> {
    return this.rolePermissionRepository.count(where);
  }

  @get('/role-permission', {
    responses: {
      '200': {
        description: 'Array of RolePermission model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(RolePermission, {
                includeRelations: true,
              }),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(RolePermission) filter?: Filter<RolePermission>,
  ): Promise<RolePermission[]> {
    return this.rolePermissionRepository.find(filter);
  }

  @patch('/role-permission', {
    responses: {
      '200': {
        description: 'RolePermission PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RolePermission, {partial: true}),
        },
      },
    })
    rolePermission: RolePermission,
    @param.where(RolePermission) where?: Where<RolePermission>,
  ): Promise<Count> {
    return this.rolePermissionRepository.updateAll(rolePermission, where);
  }

  @get('/role-permission/{id}', {
    responses: {
      '200': {
        description: 'RolePermission model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(RolePermission, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(RolePermission, {exclude: 'where'})
    filter?: FilterExcludingWhere<RolePermission>,
  ): Promise<RolePermission> {
    return this.rolePermissionRepository.findById(id, filter);
  }

  @patch('/role-permission/{id}', {
    responses: {
      '204': {
        description: 'RolePermission PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RolePermission, {partial: true}),
        },
      },
    })
    rolePermission: RolePermission,
  ): Promise<void> {
    await this.rolePermissionRepository.updateById(id, rolePermission);
  }

  @put('/role-permission/{id}', {
    responses: {
      '204': {
        description: 'RolePermission PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() rolePermission: RolePermission,
  ): Promise<void> {
    await this.rolePermissionRepository.replaceById(id, rolePermission);
  }

  @del('/role-permission/{id}', {
    responses: {
      '204': {
        description: 'RolePermission DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.rolePermissionRepository.deleteById(id);
  }
}
