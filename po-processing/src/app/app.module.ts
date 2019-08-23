import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injectable, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WarehouseFormComponent } from './components/warehouse-form/warehouse-form.component';
import { PoFormComponent } from './components/po-form/po-form.component';

import * as Sentry from '@sentry/browser';
import { CommonFormComponent } from './components/common-form/common-form.component';
import { ClickableContentComponent } from './components/clickable-content/clickable-content.component';
import { UploadExcelComponent } from './components/upload-excel/upload-excel.component';
Sentry.init({
  dsn: 'https://07d41a48a53b4db484fdcf0d31ac78cc@sentry.io/1540295',
  integrations(integrations) {
    return integrations.filter(
      integration => integration.name !== 'Breadcrumbs'
    );
  }
});

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  constructor() {}
  handleError(error) {
    const eventId = Sentry.captureException(error.originalError || error);
    Sentry.showReportDialog({ eventId });
  }
}

@NgModule({
  declarations: [
    AppComponent,
    WarehouseFormComponent,
    PoFormComponent,
    CommonFormComponent,
    ClickableContentComponent,
    UploadExcelComponent
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [{ provide: ErrorHandler, useClass: SentryErrorHandler }],
  bootstrap: [AppComponent]
})
export class AppModule {}
