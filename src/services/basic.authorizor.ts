// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {
  AuthorizationContext,
  AuthorizationDecision,
  AuthorizationMetadata,
  Authorizer,
} from '@loopback/authorization';
import {Provider} from '@loopback/core';
import {repository} from '@loopback/repository';
import {securityId, UserProfile} from '@loopback/security';
import _ from 'lodash';
import {Role} from '../models';
import {RoleRepository, UserRepository} from '../repositories';

export class MyAuthorizationProvider implements Provider<Authorizer> {
  constructor(
    @repository(UserRepository) private userRepository: UserRepository,
    @repository(RoleRepository) private roleRepository: RoleRepository,
  ) {}

  /**
   * @returns an authorizer function
   *
   */
  value(): Authorizer {
    return this.authorize.bind(this);
  }

  async authorize(
    context: AuthorizationContext,
    metadata: AuthorizationMetadata,
  ): Promise<AuthorizationDecision> {
    // No access if authorization details are missing
    let currentUser: UserProfile & {roles: Role[]};

    if (context.principals.length > 0) {
      const user = _.pick(context.principals[0], ['id', 'firstName']);

      const userRoleModels = await this.userRepository
        .userRoles(user.id)
        .find();
      const userRoleIds = userRoleModels.map(userRole => userRole.id);

      const roles = await this.roleRepository.find({
        where: {id: {inq: userRoleIds}},
      });

      currentUser = {
        [securityId]: user.id,
        name: user.firstName,
        roles,
      };
    } else {
      return AuthorizationDecision.DENY;
    }

    if (!currentUser.roles || currentUser.roles.length === 0) {
      return AuthorizationDecision.DENY;
    }

    // Authorize everything that does not have a allowedRoles property
    if (!metadata.allowedRoles) {
      return AuthorizationDecision.ALLOW;
    }

    if (
      !currentUser.roles.find(role =>
        metadata.allowedRoles?.includes(role.slug),
      )
    ) {
      return AuthorizationDecision.DENY;
    }

    // Admin and support accounts bypass id verification
    if (currentUser.roles.find(role => role.slug === 'admin')) {
      return AuthorizationDecision.ALLOW;
    }

    // /**
    //  * Allow access only to model owners, using route as source of truth
    //  *
    //  * eg. @post('/users/{userId}/orders', ...) returns `userId` as args[0]
    //  */
    // if (currentUser[securityId] === context.invocationContext.args[0]) {
    //   return AuthorizationDecision.ALLOW;
    // }

    return AuthorizationDecision.DENY;
  }
}
