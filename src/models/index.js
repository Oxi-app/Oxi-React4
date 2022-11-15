// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Basket, Materials, Item } = initSchema(schema);

export {
  Basket,
  Materials,
  Item
};