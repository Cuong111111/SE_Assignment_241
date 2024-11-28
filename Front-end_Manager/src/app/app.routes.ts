import { Routes } from '@angular/router';
import { HistoryComponent } from './Components/history/history.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginComponent } from './components/login/login.component';
import { PrintingComponent } from './Components/print/printing.component';
import { DashboardComponent } from './dashboard/dashboard.component';
// import { DashboardComponent } from './components/dashboard/dashboard.component';
// import { PrintHistoryComponent } from './components/student-history-log/student-history-log.component';
export const routes: Routes = [
    { path: '', component: LandingPageComponent },
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'print', component: PrintingComponent },
    { path: 'history', component: HistoryComponent },
    // { path: 'dashboard', component: DashboardComponent },
    // { path: 'history', component: PrintHistoryComponent },
];
