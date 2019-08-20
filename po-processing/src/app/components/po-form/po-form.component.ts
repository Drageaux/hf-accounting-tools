import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PurchaseOrder } from 'src/app/purchase-order';
import { PurchaseOrderLine } from 'src/app/purchase-order-line';
import { PurchaseOrderSet } from 'src/app/purchase-order-set';
import { SKU } from 'src/app/types';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-po-form',
  templateUrl: './po-form.component.html',
  styleUrls: ['./po-form.component.scss']
})
export class PoFormComponent implements OnInit {
  poSet = new PurchaseOrderSet('hello');
  purchaseOrderAddressInput = '';
  purchaseOrderDataInput = '';
  purchaseOrderPreview;
  poSetAllItemsAndQuant: Map<SKU, number>;

  constructor() {}

  ngOnInit() {}

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

  onKeydown($event: KeyboardEvent, form: NgForm) {
    if ($event.ctrlKey && $event.keyCode === 13) {
      form.ngSubmit.emit();
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
}
