import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { DriverManagementComponent } from './components/admin/driver-management/driver-management.component';
import { RideManagementComponent } from './components/admin/ride-management/ride-management.component';
import { CustomerDashboardComponent } from './components/customer/customer-dashboard/customer-dashboard.component';
import { authGuard } from './guards/auth.guard';
import { RideBookingComponent } from './components/customer/ride-booking/ride-booking.component';
import { RideHistoryComponent } from './components/customer/ride-history/ride-history.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    // Admin Routes
    {
        path: 'admin',
        canActivate: [authGuard],
        data: { role: 'admin' },
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: AdminDashboardComponent },
            { path: 'drivers', component: DriverManagementComponent },
            { path: 'rides', component: RideManagementComponent }
        ]
    },

    // Customer Routes
    {
        path: 'customer',
        canActivate: [authGuard],
        data: { role: 'customer' },
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: CustomerDashboardComponent },
            { path: 'book-ride', component: RideBookingComponent },
            { path: 'ride-history', component: RideHistoryComponent }
        ]
    },

    { path: '**', redirectTo: 'login' }
];
