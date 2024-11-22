import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { LandingPageComponent } from './Components/landing-page/landing-page.component';
import { LoginComponent } from './Components/login/login.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { PrintHistoryComponent } from './Components/student-history-log/student-history-log.component';
import { PrintPageComponent } from './Components/print-page/print-page.component';
export const routes: Routes = [
    { path: '', component: LandingPageComponent },
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'history', component: PrintHistoryComponent },
    { path: 'print-page', component: PrintPageComponent  }
];
