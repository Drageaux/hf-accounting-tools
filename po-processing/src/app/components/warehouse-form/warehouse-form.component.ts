import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
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
export class WarehouseFormComponent implements OnInit, AfterViewInit {
  @Input() initialInput: string;
  @Output() submitEvent = new EventEmitter<string>();
  @ViewChild('warehouseDataEl', { static: false }) inputEl: ElementRef;
  warehouseInput: string;

  constructor() {}

  ngOnInit() {
    this.warehouseInput = this.initialInput;
  }

  ngAfterViewInit() {
    this.inputEl.nativeElement.focus();
  }

  onSubmit() {
    this.submitEvent.emit(this.warehouseInput);
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
