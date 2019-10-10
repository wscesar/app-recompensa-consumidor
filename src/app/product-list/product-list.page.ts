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

    private products: Product[];
    private restaurants: Restaurant[] = [];
    private isLoading = true;

    constructor(
        private restaurantService: RestaurantService,
        private productService: ProductService
    ) {}

    ngOnInit() {
        this.productService.getAllProducts().subscribe(products => {

            this.products = products;

            for (const p of products) {
                this.restaurantService.getRestaurant(p.restaurantId).subscribe(restaurant => {
                    this.restaurants.push(restaurant);
                    this.isLoading = false;
                    // console.log(restaurant);
                });
            }

        });
    }

}
