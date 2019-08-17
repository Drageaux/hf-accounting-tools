import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { Lot } from './lot';
import { PurchaseOrderLine } from './purchase-order-line';

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
  purchaseOrderPreview;

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

    const result = [];

    for (const line of lines) {
      const rawLineData = line.trim().split('\n');

      let unitCost: number;
      try {
        unitCost = parseFloat(rawLineData[5].split(':')[1].trim());
      } catch (e) {
        console.error(e);
        unitCost = undefined;
      }
      const newPoLine = new PurchaseOrderLine({
        line: parseInt(rawLineData[0], 10) || null,
        itemSku: rawLineData[2],
        description: rawLineData[4],
        unitCost,
        quantity: parseInt(rawLineData[6], 2) || undefined,
        unit: rawLineData[7]
      });
      result.push(newPoLine);
    }
    console.log(result);
    this.purchaseOrderPreview = result;
  }
}
