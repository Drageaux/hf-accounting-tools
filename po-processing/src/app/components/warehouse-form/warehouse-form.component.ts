import { Component, OnInit } from '@angular/core';
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
  warehouseInput = '';
  warehouseTotalAvailable = 0;
  warehouseDataPreview: Map<string, Lot>;
  newWarehouseDataPreview: Map<SKU, Lot[]> = new Map();

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
