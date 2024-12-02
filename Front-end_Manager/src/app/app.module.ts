import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ButtonPageComponent } from './button-page/button-page.component';
import { HistoryServiceComponent } from './history-service/history-service.component';
import { PrinterServiceComponent } from './printer-service/printer-service.component';
import { SystemConfigComponent } from './system-config/system-config.component';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    SystemConfigComponent,
    PrinterServiceComponent,
    HistoryServiceComponent,
    ButtonPageComponent
  ],
})
export class AppModule { }
