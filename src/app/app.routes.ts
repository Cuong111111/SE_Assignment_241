import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PrintHistoryComponent } from './components/student-history-log/student-history-log.component';
import { PrintingComponent } from './components/printing/printing.component';
import { BuyPagesComponent } from './components/buy-pages/buy-pages.component';
import { PrinterViewComponent } from './components/printer-view/printer-view.component';
import { PrintPageComponent } from './components/print-page/print-page.component'
import { ButtonPageComponent } from './components/button-page/button-page.component'
export const routes: Routes = [
    { path: '', component: LandingPageComponent },
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'history', component: PrintHistoryComponent },
    { path: 'print', component: PrintingComponent },
    { path: 'buy', component: BuyPagesComponent },
    { path: 'printer', component: PrinterViewComponent },
    { path: 'printPage', component: PrintPageComponent},
    { path: 'button-page', component: ButtonPageComponent}
];
