import { PurchaseOrderLine } from './purchase-order-line';

export class PurchaseOrder {
  lines: PurchaseOrderLine[];
  shipTo: string;
}
