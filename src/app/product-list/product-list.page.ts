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

            for (const restaurant of restaurants) {
                this.productService.getProducts(restaurant.id).subscribe( products => {
                    for (const p of products) {
                        console.log(p);
                        this.products.push({
                                            ...p,
                                            restaurantId: restaurant.id,
                                            restaurantTitle: restaurant.title,
                                        });
                    }
                });
            }

            console.log(this.products);
            this.isLoading = false;
        });


    }

}
