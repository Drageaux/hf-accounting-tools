import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { Lot } from './lot';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'po-processing';
  warehouseInput = '';
  warehouseTotalAvailable = 0;
  warehouseDataPreview;
  purchaseOrderInput = '';

  constructor(private cd: ChangeDetectorRef) {}

  parseWarehouseData() {
    if (this.warehouseInput.trim() === '') {
      return null;
    }
    this.warehouseTotalAvailable = 0;
    const lotsData = this.warehouseInput.split('\n');
    const result = [];

    for (const l of lotsData) {
      const rawLotData = l.split('\t');
      const newLot = new Lot({
        lotId: rawLotData[4],
        itemSku: rawLotData[0],
        availableQuant: parseInt(rawLotData[7], 10) || 0
      });

      this.warehouseTotalAvailable += newLot.availableQuant;
      result.push(newLot);
    }
    this.warehouseDataPreview = result;
    return result;
  }
}
