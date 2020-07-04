import {hasMany, model, property} from '@loopback/repository';
import {Rating} from './rating.model';
import {SoftDeleteEntity} from './soft-delete.entity';

@model({
  settings: {
    strict: false,
    forceId: false,
  },
})
export class Movie extends SoftDeleteEntity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
  })
  genres?: string;

  @property({
    type: 'string',
  })
  photoPath?: string;

  @property({
    type: 'date',
    defaultFn: 'now',
    columnName: 'created_at',
  })
  createdAt?: string;

  @hasMany(() => Rating)
  ratings: Rating[];

  ratingsCount?: number;
  ratingsSum?: number;

  constructor(data?: Partial<Movie>) {
    super(data);
  }
}

export interface MovieRelations {
  // describe navigational properties here
}

export type MovieWithRelations = Movie & MovieRelations;
