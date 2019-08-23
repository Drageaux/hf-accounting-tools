import { Lot } from './lot';

export type SKU = string;
export type LotID = string;
export type Quantity = number;
export type Dollar = number;
export type QuantityPerSKU = Map<SKU, Quantity>;
export type QuantityPerLot = Map<LotID, Quantity>;
export type LotsBySKU = Map<SKU, Lot[]>;
export type OutboundResult = Map<
  SKU,
  { qtyPerLot: QuantityPerLot; remaining: Quantity }
>;
