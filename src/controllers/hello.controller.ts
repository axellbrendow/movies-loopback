import {get} from '@loopback/rest';

export class HelloController {
  @get('/hello')
  hello() {
    return 'Hello World';
  }
}
