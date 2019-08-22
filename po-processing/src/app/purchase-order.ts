import { PurchaseOrderLine } from './purchase-order-line';
import { SKU } from './types';

export class PurchaseOrder {
  lines = new Map<SKU, PurchaseOrderLine>();
  shipTo: string;
}

export interface PurchaseOrderForm {
  address: string;
  data: string;
}
