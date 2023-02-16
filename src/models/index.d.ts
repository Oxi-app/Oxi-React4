import { ModelInit, MutableModel } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";

type ExampleItemMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type FuelMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ElectricityMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type TransportMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type RawMaterialsMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ProcessesMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type LogisticsMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type BasketMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type MaterialsMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ItemMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type EagerExampleItem = {
  readonly id: string;
  readonly Barcode?: string | null;
  readonly Merchant?: string | null;
  readonly Name?: string | null;
  readonly Price?: string | null;
  readonly Material?: string | null;
  readonly Weight?: string | null;
  readonly Carbon?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyExampleItem = {
  readonly id: string;
  readonly Barcode?: string | null;
  readonly Merchant?: string | null;
  readonly Name?: string | null;
  readonly Price?: string | null;
  readonly Material?: string | null;
  readonly Weight?: string | null;
  readonly Carbon?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type ExampleItem = LazyLoading extends LazyLoadingDisabled ? EagerExampleItem : LazyExampleItem

export declare const ExampleItem: (new (init: ModelInit<ExampleItem, ExampleItemMetaData>) => ExampleItem) & {
  copyOf(source: ExampleItem, mutator: (draft: MutableModel<ExampleItem, ExampleItemMetaData>) => MutableModel<ExampleItem, ExampleItemMetaData> | void): ExampleItem;
}

type EagerFuel = {
  readonly id: string;
  readonly Type?: string | null;
  readonly CO2perkg?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyFuel = {
  readonly id: string;
  readonly Type?: string | null;
  readonly CO2perkg?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Fuel = LazyLoading extends LazyLoadingDisabled ? EagerFuel : LazyFuel

export declare const Fuel: (new (init: ModelInit<Fuel, FuelMetaData>) => Fuel) & {
  copyOf(source: Fuel, mutator: (draft: MutableModel<Fuel, FuelMetaData>) => MutableModel<Fuel, FuelMetaData> | void): Fuel;
}

type EagerElectricity = {
  readonly id: string;
  readonly Source?: string | null;
  readonly CO2perkWh?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyElectricity = {
  readonly id: string;
  readonly Source?: string | null;
  readonly CO2perkWh?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Electricity = LazyLoading extends LazyLoadingDisabled ? EagerElectricity : LazyElectricity

export declare const Electricity: (new (init: ModelInit<Electricity, ElectricityMetaData>) => Electricity) & {
  copyOf(source: Electricity, mutator: (draft: MutableModel<Electricity, ElectricityMetaData>) => MutableModel<Electricity, ElectricityMetaData> | void): Electricity;
}

type EagerTransport = {
  readonly id: string;
  readonly Mode?: string | null;
  readonly CO2perMile?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyTransport = {
  readonly id: string;
  readonly Mode?: string | null;
  readonly CO2perMile?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Transport = LazyLoading extends LazyLoadingDisabled ? EagerTransport : LazyTransport

export declare const Transport: (new (init: ModelInit<Transport, TransportMetaData>) => Transport) & {
  copyOf(source: Transport, mutator: (draft: MutableModel<Transport, TransportMetaData>) => MutableModel<Transport, TransportMetaData> | void): Transport;
}

type EagerRawMaterials = {
  readonly id: string;
  readonly Barcode?: string | null;
  readonly Material?: string | null;
  readonly Mass?: string | null;
  readonly Carbon?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyRawMaterials = {
  readonly id: string;
  readonly Barcode?: string | null;
  readonly Material?: string | null;
  readonly Mass?: string | null;
  readonly Carbon?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type RawMaterials = LazyLoading extends LazyLoadingDisabled ? EagerRawMaterials : LazyRawMaterials

export declare const RawMaterials: (new (init: ModelInit<RawMaterials, RawMaterialsMetaData>) => RawMaterials) & {
  copyOf(source: RawMaterials, mutator: (draft: MutableModel<RawMaterials, RawMaterialsMetaData>) => MutableModel<RawMaterials, RawMaterialsMetaData> | void): RawMaterials;
}

type EagerProcesses = {
  readonly id: string;
  readonly Barcode?: string | null;
  readonly Electricity?: string | null;
  readonly Renewable?: string | null;
  readonly Source?: string | null;
  readonly Fuel?: string | null;
  readonly Type?: string | null;
  readonly Carbon?: string | null;
  readonly Name?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyProcesses = {
  readonly id: string;
  readonly Barcode?: string | null;
  readonly Electricity?: string | null;
  readonly Renewable?: string | null;
  readonly Source?: string | null;
  readonly Fuel?: string | null;
  readonly Type?: string | null;
  readonly Carbon?: string | null;
  readonly Name?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Processes = LazyLoading extends LazyLoadingDisabled ? EagerProcesses : LazyProcesses

export declare const Processes: (new (init: ModelInit<Processes, ProcessesMetaData>) => Processes) & {
  copyOf(source: Processes, mutator: (draft: MutableModel<Processes, ProcessesMetaData>) => MutableModel<Processes, ProcessesMetaData> | void): Processes;
}

type EagerLogistics = {
  readonly id: string;
  readonly Barcode?: string | null;
  readonly Location?: string | null;
  readonly Distance?: string | null;
  readonly Mode?: string | null;
  readonly Carbon?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyLogistics = {
  readonly id: string;
  readonly Barcode?: string | null;
  readonly Location?: string | null;
  readonly Distance?: string | null;
  readonly Mode?: string | null;
  readonly Carbon?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Logistics = LazyLoading extends LazyLoadingDisabled ? EagerLogistics : LazyLogistics

export declare const Logistics: (new (init: ModelInit<Logistics, LogisticsMetaData>) => Logistics) & {
  copyOf(source: Logistics, mutator: (draft: MutableModel<Logistics, LogisticsMetaData>) => MutableModel<Logistics, LogisticsMetaData> | void): Logistics;
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
  readonly Name?: string | null;
  readonly Manufacturer?: string | null;
  readonly Carbon?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyItem = {
  readonly id: string;
  readonly Barcode?: string | null;
  readonly Name?: string | null;
  readonly Manufacturer?: string | null;
  readonly Carbon?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Item = LazyLoading extends LazyLoadingDisabled ? EagerItem : LazyItem

export declare const Item: (new (init: ModelInit<Item, ItemMetaData>) => Item) & {
  copyOf(source: Item, mutator: (draft: MutableModel<Item, ItemMetaData>) => MutableModel<Item, ItemMetaData> | void): Item;
}