import { PurchaseOrder } from './purchase-order';
import { SKU, Quantity } from './types';
import { KeyValue } from '@angular/common';

export class PurchaseOrderSet {
  id?: string; // TODO
  orders: PurchaseOrder[] = [];

  constructor(id) {
    this.id = id;
  }

  addOrdersToSet(pos: PurchaseOrder[]) {
    this.orders.push(...pos);
  }

  removeOrderFromSet(index) {
    this.orders.splice(index);
  }

  getAllItemsAcrossAllOrders(): Map<SKU, Quantity> {
    const result = new Map<SKU, Quantity>();
    for (const po of this.orders) {
      for (const [key, value] of po.lines.entries()) {
        if (result.has(key)) {
          let newQty = result.get(key);
          newQty = newQty + value.quantity;
          result.set(key, newQty);
        } else {
          result.set(key, value.quantity || 0);
        }
      }
    }
    return result;
  }

  getTotalQuantityOfItem(sku: SKU): KeyValue<SKU, number> {
    let result = 0;
    for (const po of this.orders) {
      const item = po.lines.get(sku);
      if (item.itemSku === sku) {
        result += item.quantity;
      }
    }
    return { key: sku, value: result };
  }
}
