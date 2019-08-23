import { Component, OnDestroy } from '@angular/core';
import {
  OutboundResult,
  QuantityPerSKU,
  LotsBySKU,
  QuantityPerLot
} from './types';
import { BehaviorSubject } from 'rxjs';
import { SubSink } from 'subsink';
import { KeyValue } from '@angular/common';
import { PurchaseOrderLine } from './purchase-order-line';
import { PurchaseOrderForm } from './purchase-order';
import { PurchaseOrderSet } from './purchase-order-set';
import { FormParseService } from './services/form-parse.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  public deployUrl = environment.deployUrl;
  private subs = new SubSink();

  poSet = new PurchaseOrderSet('hello');
  // PO Form
  poInput$ = new BehaviorSubject<PurchaseOrderForm>({
    data: '',
    address: ''
  });
  poInputBusy = false;
  // Warehouse Form
  warehouseInput$ = new BehaviorSubject('');
  warehouseInputBusy = false;
  uploadingWarehouseFile = false;

  poSetItemsWithQty: QuantityPerSKU = new Map();
  warehouseLotsBySku: LotsBySKU = new Map();
  outboundResult: OutboundResult;

  constructor(private formParser: FormParseService) {}

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

  addOrderToSet(input: PurchaseOrderForm) {
    if (input) {
      const newPo = this.formParser.parsePurchaseOrderData(input);
      if (newPo) {
        this.poSet.addOrderToSet(newPo);
        this.poSetItemsWithQty = this.poSet.getAllItemsAcrossAllOrders();
        this.poInputBusy = false;
        // this.poSetItemsWithQty.next(this.poSet.getAllItemsAcrossAllOrders());
      } else {
        this.poInput$.next({ data: '', address: '' } as PurchaseOrderForm);
      }
    } else {
      this.poInputBusy = false;
    }
  }

  // TODO: edit PO requires reversed line-parsing
  editPo(index: number) {
    // this.poInput$.next();
  }

  removePo(index) {
    this.poSet.removeOrderFromSet(index);
  }

  /**
   * When clicking on the button after all data have been collected
   */
  handleClick() {
    const poSetData = this.poSetItemsWithQty;
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

  getOutboundQtyPerLot(
    poSetRequestedItemsWithQty: QuantityPerSKU,
    warehouseData: LotsBySKU
  ) {
    console.log('=====creating outbound result=====');
    const newResult: OutboundResult = new Map();
    const requestedItems: QuantityPerSKU = new Map(poSetRequestedItemsWithQty);

    for (const [sku, qty] of requestedItems.entries()) {
      const qtyPerLot: QuantityPerLot = new Map();

      let requestedQty = qty;
      // check for the lots with this item's SKU
      const lots = warehouseData.get(sku);
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
