import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component
} from '@angular/core';
import { KeyValue } from '@angular/common';
import { Lot } from './lot';
import { LotID, SKU } from './types';
import { NgForm } from '@angular/forms';
import { PurchaseOrder } from './purchase-order';
import { PurchaseOrderLine } from './purchase-order-line';
import { PurchaseOrderSet } from './purchase-order-set';

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
  newWarehouseDataPreview: Map<SKU, Lot[]> = new Map();
  purchaseOrderAddressInput = '';
  purchaseOrderDataInput = '';
  purchaseOrderPreview: Map<string, PurchaseOrderLine>;
  poSet: PurchaseOrderSet = new PurchaseOrderSet('hello');
  poSetAllItemsAndQuant: Map<SKU, number>;

  outboundResult: Map<SKU, number> = new Map();

  constructor(private cd: ChangeDetectorRef) {}

  parseWarehouseData() {
    if (this.warehouseInput.trim() === '') {
      return null;
    }
    this.warehouseTotalAvailable = 0;
    const lotsData = this.warehouseInput
      .split('\n')
      .filter(l => l.trim() !== '');
    const newNewResult = new Map<SKU, Lot[]>();

    for (const l of lotsData) {
      const rawLotData = l.split('\t');
      const newLot = new Lot({
        lotId: rawLotData[4] as LotID,
        itemSku: rawLotData[0],
        availableQty: parseInt(rawLotData[7], 10) || 0
      });

      const existingItem = newNewResult.get(newLot.itemSku);
      if (existingItem) {
        existingItem.push(newLot);
      } else {
        newNewResult.set(newLot.itemSku, [newLot]);
      }
    }
    console.log(newNewResult);
    this.newWarehouseDataPreview = newNewResult;
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
      this.poSetAllItemsAndQuant = this.poSet.getAllItemsAcrossAllOrders();
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

  getOutboundQtyPerLot() {
    console.log('=====creating outbound result=====');
    let result = new Map<LotID, number>();
    const requestedItems: Map<SKU, number> = Object.assign(
      new Map(),
      this.poSetAllItemsAndQuant
    );
    const warehouseData: Map<LotID, Lot> = Object.assign(
      new Map(),
      this.newWarehouseDataPreview
    );

    debugger;
    for (const [sku, qty] of requestedItems.entries()) {
      let requestedQty = qty;
      // check for the lots with this item's SKU
      const lots = this.newWarehouseDataPreview.get(sku);
      if (!lots) {
        continue;
      }
      for (const lot of lots) {
        console.log('lot', lot, 'requested left:', requestedQty);
        if (result.has(lot.lotId)) {
          let newQty = result.get(lot.lotId);
          // if requested less than available, new qty = requested
          // if requested more than, new qty = available only
          // deduct new qty in result from requested qty
          // if requested is 0, then break, done for sku
          newQty +=
            requestedQty < lot.availableQty ? requestedQty : lot.availableQty;
          requestedQty -= newQty;
        }
      }
    }
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
