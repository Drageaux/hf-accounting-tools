import { LotID } from './types';

/**
 * WAREHOUSESKU
 * // MANUFACTURERSKU
 * // CUSTOMERSKU
 * DESCRIPTION
 * CUSTOMERLOTREFERENCE
 * // WAREHOUSELOTREFERENCE
 * // QTYONHAND
 * QTYAVAILABLE
 */
export class Lot {
  lotId: LotID; // 4
  description: string;
  itemSku: string; // 0
  availableQty = 0; // 7

  constructor(fields?: {
    lotId?: string;
    description?: string;
    itemSku?: string;
    availableQty?: number;
  }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
