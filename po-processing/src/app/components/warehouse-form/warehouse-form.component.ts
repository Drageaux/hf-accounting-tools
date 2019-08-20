import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { KeyValue } from '@angular/common';
import { PurchaseOrderLine } from 'src/app/purchase-order-line';
import { Lot } from 'src/app/lot';
import { SKU, LotID } from 'src/app/types';

@Component({
  selector: 'app-warehouse-form',
  templateUrl: './warehouse-form.component.html',
  styleUrls: ['./warehouse-form.component.scss']
})
export class WarehouseFormComponent implements OnInit {
  @Output() submitEvent = new EventEmitter<Map<SKU, Lot[]>>();
  warehouseInput = '';
  warehouseTotalAvailable = 0;

  constructor() {}

  ngOnInit() {}

  parseWarehouseData() {
    if (this.warehouseInput.trim() === '') {
      return null;
    }
    this.warehouseTotalAvailable = 0;
    const lotsData = this.warehouseInput
      .split('\n')
      .filter(l => l.trim() !== '');
    const result = new Map<SKU, Lot[]>();

    for (const l of lotsData) {
      const rawLotData = l.split('\t');
      const newLot = new Lot({
        lotId: rawLotData[4] as LotID,
        itemSku: rawLotData[0],
        availableQty: parseInt(rawLotData[7], 10) || 0
      });

      const existingItem = result.get(newLot.itemSku);
      if (existingItem) {
        existingItem.push(newLot);
      } else {
        result.set(newLot.itemSku, [newLot]);
      }
    }
    console.log(result);
    this.submitEvent.emit(result);
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
