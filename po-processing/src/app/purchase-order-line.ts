/**
 * Line
 * // their sku
 * Our SKU
 * UPC/GTIN
 * Description
 * Unit Cost
 * Quantity
 * Unit of Measurement
 * Total Price
 */
export class PurchaseOrderLine {
  line: number; // 0
  itemSku: string; // 2
  description = ''; // 4
  unitCost = 0; // 5
  quantity = 0; // 6
  unit: string; // 7

  constructor(fields?: {
    line?: number;
    itemSku?: string;
    description?: string;
    unitCost?: number;
    quantity?: number;
    unit?: string;
  }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }

  get itemTotal() {
    return this.unitCost * this.quantity;
  }
}
