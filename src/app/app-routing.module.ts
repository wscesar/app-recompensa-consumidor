import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
    { path: '', loadChildren: './auth/auth.module#AuthPageModule'},
    { path: 'login', loadChildren: './auth/auth.module#AuthPageModule' },

    {
        path: 'restaurantes',
        // canActivate: [AuthGuard],
        loadChildren: './restaurant-list/restaurant-list.module#RestaurantListPageModule'
    },

    {
        path: 'produtos',
        // canActivate: [AuthGuard],
        loadChildren: './product-list/product-list.module#ProductListPageModule'
    },

    {
        path: 'produto/:productId',
        // canActivate: [AuthGuard],
        loadChildren: './product-detail/product-detail.module#ProductDetailPageModule'
    },

    {
        path: 'restaurante',
        // canActivate: [AuthGuard],
        children:
        [
            {
                path: ':place',
                children:
                [
                    {
                        path: 'produto/:productId',
                        loadChildren: './product-detail/product-detail.module#ProductDetailPageModule'
                    },

                    {
                        path: '',
                        loadChildren: './restaurant-detail/restaurant-detail.module#RestaurantDetailPageModule'
                    },
                ]
            },
        ]
    },

    {
        path: 'meus-dados',
        // canActivate: [AuthGuard],
        loadChildren: './profile-edit/profile-edit.module#ProfileEditPageModule'
    },
  { path: 'product-list', loadChildren: './product-list/product-list.module#ProductListPageModule' },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
