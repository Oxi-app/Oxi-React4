import { ModelInit, MutableModel } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";

type BasketMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type MaterialsMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ItemMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type EagerBasket = {
  readonly id: string;
  readonly Barcode?: string | null;
  readonly Merchant?: string | null;
  readonly Name?: string | null;
  readonly Price?: string | null;
  readonly Weight?: string | null;
  readonly Material?: string | null;
  readonly Carbon?: string | null;
  readonly owner?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyBasket = {
  readonly id: string;
  readonly Barcode?: string | null;
  readonly Merchant?: string | null;
  readonly Name?: string | null;
  readonly Price?: string | null;
  readonly Weight?: string | null;
  readonly Material?: string | null;
  readonly Carbon?: string | null;
  readonly owner?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Basket = LazyLoading extends LazyLoadingDisabled ? EagerBasket : LazyBasket

export declare const Basket: (new (init: ModelInit<Basket, BasketMetaData>) => Basket) & {
  copyOf(source: Basket, mutator: (draft: MutableModel<Basket, BasketMetaData>) => MutableModel<Basket, BasketMetaData> | void): Basket;
}

type EagerMaterials = {
  readonly id: string;
  readonly Material?: string | null;
  readonly CO2perkg?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyMaterials = {
  readonly id: string;
  readonly Material?: string | null;
  readonly CO2perkg?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Materials = LazyLoading extends LazyLoadingDisabled ? EagerMaterials : LazyMaterials

export declare const Materials: (new (init: ModelInit<Materials, MaterialsMetaData>) => Materials) & {
  copyOf(source: Materials, mutator: (draft: MutableModel<Materials, MaterialsMetaData>) => MutableModel<Materials, MaterialsMetaData> | void): Materials;
}

type EagerItem = {
  readonly id: string;
  readonly Barcode?: string | null;
  readonly Merchant?: string | null;
  readonly Name?: string | null;
  readonly Price?: string | null;
  readonly Weight?: string | null;
  readonly Material?: string | null;
  readonly Carbon?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyItem = {
  readonly id: string;
  readonly Barcode?: string | null;
  readonly Merchant?: string | null;
  readonly Name?: string | null;
  readonly Price?: string | null;
  readonly Weight?: string | null;
  readonly Material?: string | null;
  readonly Carbon?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Item = LazyLoading extends LazyLoadingDisabled ? EagerItem : LazyItem

export declare const Item: (new (init: ModelInit<Item, ItemMetaData>) => Item) & {
  copyOf(source: Item, mutator: (draft: MutableModel<Item, ItemMetaData>) => MutableModel<Item, ItemMetaData> | void): Item;
}