import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { Lot } from './lot';
import { PurchaseOrderLine } from './purchase-order-line';
import { PurchaseOrderSet } from './purchase-order-set';
import { PurchaseOrder } from './purchase-order';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'po-processing';
  warehouseInput = '';
  warehouseTotalAvailable = 0;
  warehouseDataPreview: Map<string, Lot>;
  purchaseOrderInput = '';
  purchaseOrderPreview: Map<string, PurchaseOrderLine>;
  poSet: PurchaseOrderSet = new PurchaseOrderSet('hello');

  constructor(private cd: ChangeDetectorRef) {}

  parseWarehouseData() {
    if (this.warehouseInput.trim() === '') {
      return null;
    }
    this.warehouseTotalAvailable = 0;
    const lotsData = this.warehouseInput
      .split('\n')
      .filter(l => l.trim() !== '');
    const newResult = new Map<string, Lot>();

    for (const l of lotsData) {
      const rawLotData = l.split('\t');
      const newLot = new Lot({
        lotId: rawLotData[4],
        itemSku: rawLotData[0],
        availableQuant: parseInt(rawLotData[7], 10) || undefined
      });

      const existingLot = newResult.get(newLot.lotId);
      if (existingLot) {
        existingLot.availableQuant += newLot.availableQuant;
      } else {
        newResult.set(newLot.lotId, newLot);
      }
    }
    console.log(newResult);
    this.warehouseDataPreview = newResult;
  }

  parsePurchaseOrderData() {
    if (this.purchaseOrderInput.trim() === '') {
      return null;
    }

    const lines = this.purchaseOrderInput
      .trim()
      .split('\n\n')
      .filter(l => l.trim() !== '');
    console.log(lines);

    const po = new PurchaseOrder();
    po.shipTo = '';

    for (const line of lines) {
      const rawLineData = line.trim().split('\n');

      const sku = rawLineData[2];
      if (!sku) {
        continue;
      }
      let unitCost: number;
      try {
        unitCost = parseFloat(rawLineData[5].split(':')[1].trim());
      } catch (e) {
        console.error(e);
        unitCost = undefined;
      }
      const newPoLine = new PurchaseOrderLine({
        line: parseInt(rawLineData[0], 10) || null,
        itemSku: sku,
        description: rawLineData[4],
        unitCost,
        quantity: parseInt(rawLineData[6], 10) || undefined,
        unit: rawLineData[7]
      });
      po.lines.set(sku.toString(), newPoLine);
    }
    console.log(this.poSet);
    return po;
  }

  addOrderToSet() {
    const newPo = this.parsePurchaseOrderData();
    this.poSet.addOrderToSet(newPo);
    this.purchaseOrderInput = '';
    console.log(this.poSet.getTotalQuantityOfItem('HFJW32'));
  }
}
