/**
 * Item Code
 * Description
 * Whse Lot #
 * Receipt Date
 * Customer Lot
 * Whse Lot Reference
 * Pallet Id
 * Qty Available
 * Qty On Hand
 * Weight On Hand
 * Cube On Hand
 */
export class Lot {
  lotId: string; // 2
  itemSku: string; // 0
  availableQuant: number; // 7

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
