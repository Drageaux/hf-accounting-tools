import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WarehouseFormComponent } from './components/warehouse-form/warehouse-form.component';
import { PoFormComponent } from './components/po-form/po-form.component';

@NgModule({
  declarations: [AppComponent, WarehouseFormComponent, PoFormComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
