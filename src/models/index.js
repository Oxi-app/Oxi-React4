// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { ExampleItem, Fuel, Electricity, Transport, RawMaterials, Processes, Logistics, Basket, Materials, Item } = initSchema(schema);

export {
  ExampleItem,
  Fuel,
  Electricity,
  Transport,
  RawMaterials,
  Processes,
  Logistics,
  Basket,
  Materials,
  Item
};