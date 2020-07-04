import {Entity, model, property} from '@loopback/repository';

enum RatingLevel {
  TOO_BAD = 0,
  BAD = 1,
  REGULAR = 2,
  GOOD = 3,
  VERY_GOOD = 4,
}

@model({
  settings: {
    strict: false,
    forceId: false,
  },
})
export class Rating extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
  })
  userId: number;

  @property({
    type: 'number',
    required: true,
  })
  movieId: number;

  @property({
    type: 'number',
    required: true,
    jsonSchema: {
      enum: Object.values(RatingLevel),
    },
  })
  rating: number;

  @property({
    type: 'date',
    defaultFn: 'now',
    columnName: 'created_at',
  })
  createdAt?: string;

  constructor(data?: Partial<Rating>) {
    super(data);
  }
}

export interface RatingRelations {
  // describe navigational properties here
}

export type RatingWithRelations = Rating & RatingRelations;
