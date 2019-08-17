import { PurchaseOrder } from './purchase-order';
import { SKU } from './types';

export class PurchaseOrderSet {
  id?: string; // TODO
  orders: PurchaseOrder[] = [];

  constructor(id) {
    this.id = id;
  }

  addOrderToSet(po: PurchaseOrder) {
    this.orders.push(po);
  }

  getTotalQuantityOfItem(sku: SKU) {
    let result = 0;
    for (const po of this.orders) {
      const item = po.lines.get(sku);
      if (item.itemSku === sku) {
        result += item.quantity;
      }
    }
    return result;
  }
}
