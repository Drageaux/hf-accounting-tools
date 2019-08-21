import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PurchaseOrder } from 'src/app/purchase-order';
import { PurchaseOrderLine } from 'src/app/purchase-order-line';
import { PurchaseOrderSet } from 'src/app/purchase-order-set';
import { SKU, Quantity, Dollar } from 'src/app/types';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-po-form',
  templateUrl: './po-form.component.html',
  styleUrls: ['./po-form.component.scss']
})
export class PoFormComponent implements OnInit {
  @Output() submitEvent = new EventEmitter<PurchaseOrder>();
  purchaseOrderAddressInput;
  purchaseOrderDataInput;
  purchaseOrderPreview;
  poSetAllItemsAndQuant: Map<SKU, Quantity>;

  constructor() {}

  ngOnInit() {}

  parsePurchaseOrderData() {
    if (
      this.purchaseOrderDataInput.trim() === '' ||
      this.purchaseOrderAddressInput.trim() === ''
    ) {
      this.submitEvent.emit(null);
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
      let unitPrice: Dollar;
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
    this.submitEvent.emit(po);
  }

  onKeydown($event: KeyboardEvent, form: NgForm) {
    if ($event.ctrlKey && $event.keyCode === 13) {
      form.ngSubmit.emit();
    }
  }
}
