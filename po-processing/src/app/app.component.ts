import { Component, OnDestroy } from '@angular/core';
import { LotID, SKU, Quantity } from './types';
import { BehaviorSubject } from 'rxjs';
import { Lot } from './lot';
import { SubSink } from 'subsink';
import { KeyValue } from '@angular/common';
import { PurchaseOrderLine } from './purchase-order-line';
import { PurchaseOrder } from './purchase-order';
import { PurchaseOrderSet } from './purchase-order-set';
import { FormParseService } from './services/form-parse.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  private subs = new SubSink();
  poSet = new PurchaseOrderSet('hello');

  poInput = '';
  poSetItemsWithQty = new BehaviorSubject<Map<any, any>>(new Map());
  poInputBusy = false;

  warehouseInput$ = new BehaviorSubject('');
  warehouseLotsBySku = new Map<SKU, Lot[]>();
  warehouseInputBusy = false;
  uploadingWarehouseFile = false;

  outboundResult: Map<
    SKU,
    { qtyPerLot: Map<LotID, Quantity>; remaining: Quantity }
  >;

  constructor(private formParser: FormParseService) {
    // this.subs.sink = combineLatest(
    //   this.poSetItemsWithQty$,
    //   this.warehouseLotsBySku$
    // )
    //   .pipe(
    //     map(([poSetData, warehouseData]) => {
    //       console.log('combining latest');
    //       if (
    //         !poSetData ||
    //         !warehouseData ||
    //         poSetData.size === 0 ||
    //         warehouseData.size === 0
    //       ) {
    //         return null;
    //       }
    //       return this.getOutboundQtyPerLot(poSetData, warehouseData);
    //     })
    //   )
    //   .subscribe(val => {
    //     this.outboundResult = val;
    //   });
  }

  handleWarehouseSubmit(input: string) {
    this.warehouseInput$.next(input);
    this.warehouseLotsBySku = this.formParser.parseWarehouseData(input);
    this.warehouseInputBusy = false;
  }

  uploadWarehouseExcelFile(inputEl) {
    if (inputEl && inputEl.files && inputEl.files.length) {
      const files = inputEl.files;
      const file = files.item(0);
      const reader = new FileReader();
      // reader.onload = event => console.log((event.target as FileReader).result);
      reader.onload = event => {
        console.log(event);
      };
      reader.onerror = error => console.error(error);
      reader.readAsText(file);
    }
  }

  addOrderToSet(po: PurchaseOrder) {
    if (po) {
      this.poSet.addOrderToSet(po);
      this.poSetItemsWithQty.next(this.poSet.getAllItemsAcrossAllOrders());
    }
  }

  /**
   * When clicking on the button after all data have been collected
   */
  handleClick() {
    const poSetData = this.poSetItemsWithQty.value;
    const warehouseData = this.warehouseLotsBySku;
    if (
      !poSetData ||
      !warehouseData ||
      poSetData.size === 0 ||
      warehouseData.size === 0
    ) {
      this.outboundResult = null;
    }
    this.outboundResult = this.getOutboundQtyPerLot(poSetData, warehouseData);
  }

  getOutboundQtyPerLot(poSetItemsAndQuant, warehouseDataPreview) {
    console.log('=====creating outbound result=====');
    const newResult = new Map<
      SKU,
      { qtyPerLot: Map<LotID, Quantity>; remaining: Quantity }
    >();
    const requestedItems: Map<SKU, Quantity> = new Map(poSetItemsAndQuant);

    for (const [sku, qty] of requestedItems.entries()) {
      const qtyPerLot = new Map<LotID, Quantity>();

      let requestedQty = qty;
      // check for the lots with this item's SKU
      const lots = warehouseDataPreview.get(sku);
      if (!lots) {
        continue;
      }
      for (const lot of lots) {
        // if requested less than available, new qty = requested
        // if requested more than, new qty = available only
        // deduct new qty in result from requested qty
        // if requested is 0, then break, done for sku
        const transactionQty =
          requestedQty < lot.availableQty ? requestedQty : lot.availableQty;
        requestedQty -= transactionQty;

        //
        const recordOutbound = qtyPerLot.get(lot.lotId) || 0;
        qtyPerLot.set(lot.lotId, recordOutbound + transactionQty);

        if (requestedQty === 0) {
          break;
        }
      }
      if (requestedQty > 0) {
      }
      newResult.set(sku, { qtyPerLot, remaining: requestedQty });
    }
    return newResult;
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

  log($event) {
    console.log($event);
  }

  // Unsubscribe when the component dies
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
