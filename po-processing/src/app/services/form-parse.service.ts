import { Injectable } from '@angular/core';
import { SKU, LotID, Dollar } from '../types';
import { Lot } from '../lot';
import { PurchaseOrder, PurchaseOrderForm } from '../purchase-order';
import {
  PurchaseOrderLine,
  PurchaseOrderLineField
} from '../purchase-order-line';

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

  parsePurchaseOrderData(input: string) {
    const results = [];
    const orders = input
      .trim()
      .split('---')
      .filter(l => l.trim() !== '');
    for (const o of orders) {
      const newPo = this.makeNewPurchaseOrder({ address: 'test', data: o });
      console.log(newPo);
      results.push(newPo);
    }
    return results;
  }

  makeNewPurchaseOrder(input: PurchaseOrderForm): PurchaseOrder {
    const { address, data } = input;
    if (!data.trim() || !address.trim() || !data.trim().split('\t')) {
      return null;
    }
    const po = new PurchaseOrder();
    po.shipTo = address;

    debugger;
    const lines = data
      .trim()
      .split('\n')
      .filter(l => l.trim() !== '');

    for (const line of lines) {
      if (!line.trim()) {
        continue;
      }
      const rawLineData = line.trim().split('\t');

      const sku = rawLineData[PurchaseOrderLineField.sku];
      if (!sku) {
        continue;
      }
      let unitPrice: Dollar;
      try {
        unitPrice = parseFloat(
          rawLineData[PurchaseOrderLineField.price].split(':')[1].trim()
        );
      } catch (e) {
        console.error(e);
        return null;
      }
      const newPoLine = new PurchaseOrderLine({
        line: parseInt(rawLineData[PurchaseOrderLineField.line], 10) || null,
        itemSku: sku,
        description: rawLineData[PurchaseOrderLineField.description],
        unitPrice,
        quantity:
          parseInt(rawLineData[PurchaseOrderLineField.quantity], 10) ||
          undefined,
        unit: rawLineData[PurchaseOrderLineField.unit]
      });
      po.lines.set(sku.toString(), newPoLine);
    }
    return po;
  }
}
