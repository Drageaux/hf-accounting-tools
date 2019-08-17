import { PurchaseOrder } from './purchase-order';

export class PurchaseOrderSet {
  id?: string; // TODO
  orders: PurchaseOrder[] = [];

  getTotalQuantityOfItem(sku: SKU) {
    let result = 0;
    for (const po of this.orders) {
      for (const line of po.lines) {
        result += line.itemSku === sku ? line.quantity : 0;
      }
    }
    return result;
  }
}
