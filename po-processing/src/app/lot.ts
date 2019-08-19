/**
 * Item Code
 * Description
 * Customer Lot
 * Whse Lot Reference
 * Qty On Hand
 * Qty Available
 */
export class Lot {
  lotId: string; // 2
  itemSku: string; // 0
  availableQuant = 0; // 5

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
