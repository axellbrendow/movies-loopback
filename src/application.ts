import {AuthenticationComponent} from '@loopback/authentication';
import {
  AuthorizationComponent,
  AuthorizationTags,
} from '@loopback/authorization';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, createBindingFromClass} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import multer from 'multer';
import path from 'path';
import {JWTAuthenticationStrategy} from './authentication-strategies/jwt-strategy';
import {
  PasswordHasherBindings,
  StorageServiceBindings,
  TokenServiceBindings,
  TokenServiceConstants,
  UserServiceBindings,
} from './keys';
import {
  MovieRepository,
  PermissionRepository,
  RatingRepository,
  RoleRepository,
  UserRepository,
  UserRoleRepository,
} from './repositories';
import {MySequence} from './sequence';
import {MyAuthorizationProvider} from './services/basic.authorizor';
import {BcryptHasher} from './services/hash.password.bcryptjs';
import {JWTService} from './services/jwt-service';
import {MyUserService} from './services/user-service';

export {ApplicationConfig};

export class MoviesApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    this.setUpBindings();

    this.component(AuthenticationComponent);
    this.component(AuthorizationComponent);

    // authentication
    this.add(createBindingFromClass(JWTAuthenticationStrategy));

    this.bind('authorizationProviders.basic')
      .toProvider(MyAuthorizationProvider)
      .tag(AuthorizationTags.AUTHORIZER);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.configureFileUpload(options.fileStorageDirectory);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  setUpBindings(): void {
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(
      TokenServiceConstants.TOKEN_SECRET_VALUE,
    );

    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
      TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE,
    );

    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);

    // // Bind bcrypt hash services
    this.bind(PasswordHasherBindings.ROUNDS).to(10);
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);

    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService);
  }

  /**
   * Configure `multer` options for file upload
   */
  protected configureFileUpload(destination?: string) {
    destination = destination ?? path.join(__dirname, '../.sandbox');

    this.bind(StorageServiceBindings.STORAGE_DIRECTORY).to(destination);

    const multerOptions: multer.Options = {
      storage: multer.diskStorage({
        destination,
        filename: (req, file, cb) => {
          cb(
            null,
            `${new Date().toISOString().slice(0, 10 + 9)}-${file.originalname}`,
          );
        },
      }),
    };

    this.configure(StorageServiceBindings.FILE_UPLOAD_SERVICE).to(
      multerOptions,
    );
  }

  public async seed() {
    const roleRepository = await this.getRepository(RoleRepository);
    const permissionRepository = await this.getRepository(PermissionRepository);
    const movieRepository = await this.getRepository(MovieRepository);
    const ratingRepository = await this.getRepository(RatingRepository);
    const userRepository = await this.getRepository(UserRepository);
    const userRoleRepository = await this.getRepository(UserRoleRepository);
    // const userPermissionRepository = await this.getRepository(
    //   UserPermissionRepository,
    // );
    // const userRoleRepository = await this.getRepository(UserRoleRepository);
    // const rolePermissionRepository = await this.getRepository(
    //   RolePermissionRepository,
    // );

    await Promise.all([
      roleRepository.seed(),
      permissionRepository.seed(),
      movieRepository.seed(),
      ratingRepository.seed(),
      userRepository.seed(),
    ]);

    await Promise.all([userRoleRepository.seed()]);
  }
}
