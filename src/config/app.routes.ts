import {Routes, RouterModule} from "@angular/router";
import {HomeComponent} from "../components/home/home.component";
import {ModuleWithProviders} from "@angular/core";

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    { path: 'home',
       component: HomeComponent
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);