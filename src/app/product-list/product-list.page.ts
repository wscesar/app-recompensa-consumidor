import { Component, OnInit } from '@angular/core';
import { Product } from '../model/product.model';
import { ProductService } from '../services/product.service';
import { RestaurantService } from '../services/restaurant.service';
import { Restaurant } from '../model/restaurant.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
})
export class ProductListPage implements OnInit {

    // private products: Product[] = [];
    private products = [];
    private restaurants: Restaurant[] = [];
    private isLoading = true;

    constructor(
        private restaurantService: RestaurantService,
        private productService: ProductService
    ) {}

    ngOnInit() {
        this.restaurantService.getRestaurants().subscribe( restaurants => {

            for (const r of restaurants) {
                this.productService.getProducts(r.id).subscribe( products => {
                    for (const p of products) {
                        // this.restaurants.push(r);
                        this.products.push({...p, restaurant: r.title});
                    }
                });
            }

            this.products.sort(this.rfunc);

            this.isLoading = false;
        });

    }

    rfunc() {
        return 0.5 - Math.random();
    }

}
