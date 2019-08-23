import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { PurchaseOrderForm } from 'src/app/purchase-order';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-common-form',
  templateUrl: './common-form.component.html',
  styleUrls: ['./common-form.component.scss']
})
export class CommonFormComponent implements OnInit, AfterViewInit {
  @Input() fieldId;
  @Input() label = 'Label';
  @Input() editing = false;
  @Input() helpText = '';

  @Input() initialInput: PurchaseOrderForm;
  @Output() submitEvent = new EventEmitter<string>();
  @ViewChild('field', { static: false }) inputEl: ElementRef;
  input;

  devEnv = !environment.production;

  constructor() {}

  ngOnInit() {
    this.input = this.initialInput;
  }

  ngAfterViewInit() {
    this.inputEl.nativeElement.focus();
  }

  onChange($event) {
    console.log($event);
  }

  onSubmit() {
    this.submitEvent.emit(this.input);
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
