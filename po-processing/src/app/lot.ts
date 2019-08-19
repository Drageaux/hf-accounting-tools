import { LotID } from './types';

/**
 * WAREHOUSESKU
 * MANUFACTURERSKU
 * CUSTOMERSKU
 * DESCRIPTION
 * CUSTOMERLOTREFERENCE
 * WAREHOUSELOTREFERENCE
 * QTYONHAND
 * QTYAVAILABLE
 */
export class Lot {
  lotId: LotID; // 2
  itemSku: string; // 0
  availableQuant = 0; // 7

  constructor(fields?: {
    lotId?: string;
    itemSku?: string;
    availableQuant?: number;
  }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
