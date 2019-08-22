import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PurchaseOrder, PurchaseOrderForm } from 'src/app/purchase-order';
import { PurchaseOrderLine } from 'src/app/purchase-order-line';
import { PurchaseOrderSet } from 'src/app/purchase-order-set';
import { SKU, Quantity, Dollar } from 'src/app/types';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-po-form',
  templateUrl: './po-form.component.html',
  styleUrls: ['./po-form.component.scss']
})
export class PoFormComponent implements OnInit {
  @Input() initialInput: PurchaseOrderForm;
  @Input() editing = false;
  @Output() submitEvent = new EventEmitter<{ data: string; address: string }>();
  addressInput;
  dataInput;
  purchaseOrderPreview;

  constructor() {}

  ngOnInit() {
    if (this.initialInput) {
      this.addressInput = this.initialInput.address;
      this.dataInput = this.initialInput.data;
    }
  }

  onSubmit() {
    this.submitEvent.emit({ data: this.dataInput, address: this.addressInput });
  }

  onCancel() {
    this.submitEvent.emit(null);
  }

  onKeydown($event: KeyboardEvent, form: NgForm) {
    if ($event.ctrlKey && $event.keyCode === 13) {
      form.ngSubmit.emit();
    }
  }
}
