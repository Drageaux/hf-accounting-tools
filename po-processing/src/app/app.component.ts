import {
  ChangeDetectorRef,
  Component,
  ChangeDetectionStrategy
} from '@angular/core';
import { LotID, SKU } from './types';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  outboundResult;

  constructor() {}

  getOutboundQtyPerLot(poSetItemsAndQuant, warehouseDataPreview) {
    console.log('=====creating outbound result=====');
    const newResult = new Map<
      SKU,
      { qtyPerLot: Map<LotID, number>; remaining: number }
    >();
    const requestedItems: Map<SKU, number> = new Map(poSetItemsAndQuant);

    for (const [sku, qty] of requestedItems.entries()) {
      const qtyPerLot = new Map<LotID, number>();

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

        console.log('lot', lot, 'after requested left:', requestedQty);
        if (requestedQty === 0) {
          break;
        }
      }
      if (requestedQty > 0) {
        console.warn('item', sku, 'still', requestedQty, 'remaining');
      }
      newResult.set(sku, { qtyPerLot, remaining: requestedQty });
    }
    console.log('result', newResult);
    this.outboundResult = newResult;
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
