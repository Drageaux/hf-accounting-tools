import { Injectable } from '@angular/core';
import { SKU, LotID } from '../types';
import { Lot } from '../lot';

@Injectable({
  providedIn: 'root'
})
export class FormParseService {
  constructor() {}

  parseWarehouseData(warehouseInput) {
    if (warehouseInput.trim() === '') {
      return new Map();
    }
    const lotsData = warehouseInput.split('\n').filter(l => l.trim() !== '');
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
    return result;
  }
}
