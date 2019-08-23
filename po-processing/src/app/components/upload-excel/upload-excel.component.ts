import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-upload-excel',
  templateUrl: './upload-excel.component.html',
  styleUrls: ['./upload-excel.component.scss']
})
export class UploadExcelComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

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
}
