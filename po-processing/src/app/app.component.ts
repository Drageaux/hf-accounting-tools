import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { Lot } from './lot';
import { PurchaseOrderLine } from './purchase-order-line';
import { PurchaseOrderSet } from './purchase-order-set';
import { PurchaseOrder } from './purchase-order';
import { KeyValue } from '@angular/common';
import { NgForm } from '@angular/forms';
import { SKU } from './types';

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
  purchaseOrderAddressInput = '';
  purchaseOrderDataInput = '';
  purchaseOrderPreview: Map<string, PurchaseOrderLine>;
  poSet: PurchaseOrderSet = new PurchaseOrderSet('hello');
  poSetAllItemsAndQuant: Map<SKU, number>;

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
        lotId: rawLotData[2],
        itemSku: rawLotData[0],
        availableQuant: parseInt(rawLotData[5], 10) || undefined
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
    if (
      this.purchaseOrderDataInput.trim() === '' ||
      this.purchaseOrderAddressInput.trim() === ''
    ) {
      return null;
    }

    const lines = this.purchaseOrderDataInput
      .trim()
      .split('\n\n')
      .filter(l => l.trim() !== '');
    console.log(lines);

    const po = new PurchaseOrder();
    po.shipTo = this.purchaseOrderAddressInput;

    for (const line of lines) {
      const rawLineData = line.trim().split('\n');

      const sku = rawLineData[2];
      if (!sku) {
        continue;
      }
      let unitPrice: number;
      try {
        unitPrice = parseFloat(rawLineData[5].split(':')[1].trim());
      } catch (e) {
        console.error(e);
        unitPrice = undefined;
      }
      const newPoLine = new PurchaseOrderLine({
        line: parseInt(rawLineData[0], 10) || null,
        itemSku: sku,
        description: rawLineData[4],
        unitPrice,
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
    if (newPo) {
      this.poSet.addOrderToSet(newPo);
      this.purchaseOrderDataInput = '';
      this.purchaseOrderAddressInput = '';
      console.log(this.poSet.getAllItemsAcrossAllOrders());
    }
  }

  lineNumberOrder(
    a: KeyValue<string, PurchaseOrderLine>,
    b: KeyValue<string, PurchaseOrderLine>
  ) {
    return a.value.line < b.value.line
      ? -1
      : a.value.line > b.value.line
      ? 1
      : 0;
  }

  onKeydown($event: KeyboardEvent, form: NgForm) {
    if ($event.ctrlKey && $event.keyCode === 13) {
      form.ngSubmit.emit();
    }
  }

  log($event) {
    console.log($event);
  }
}
