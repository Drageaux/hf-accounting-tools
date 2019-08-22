import { Injectable } from '@angular/core';
import { SKU, LotID, Dollar } from '../types';
import { Lot } from '../lot';
import { PurchaseOrder, PurchaseOrderForm } from '../purchase-order';
import { PurchaseOrderLine } from '../purchase-order-line';

@Injectable({
  providedIn: 'root'
})
export class FormParseService {
  constructor() {}

  parseWarehouseData(warehouseInput: string): Map<SKU, Lot[]> {
    if (!warehouseInput || warehouseInput.trim() === '') {
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

  parsePurchaseOrderData(input: PurchaseOrderForm): PurchaseOrder {
    const { address, data } = input;
    if (data.trim() === '' || address.trim() === '') {
      return null;
    }

    const lines = data
      .trim()
      .split('\n\n')
      .filter(l => l.trim() !== '');

    const po = new PurchaseOrder();
    po.shipTo = address;

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
        return null;
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
    return po;
  }
}
