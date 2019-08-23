export class PurchaseOrderLine {
  line: number;
  itemSku: string;
  description = '';
  unitPrice = 0;
  quantity = 0;
  unit: string;

  constructor(fields?: {
    line?: number;
    itemSku?: string;
    description?: string;
    unitPrice?: number;
    quantity?: number;
    unit?: string;
  }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }

  get itemTotal() {
    return this.unitPrice * this.quantity;
  }
}

/**
 * NOTE: Don't use customer code manuPn or
 */
export enum PurchaseOrderLineField {
  line = 0,
  sku = 2,
  description = 5,
  price = 6,
  quantity = 7,
  unit = 8
}
