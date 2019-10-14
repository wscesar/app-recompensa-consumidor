import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Restaurant } from '../model/restaurant.model';
import { Product } from '../model/product.model';
import { RestaurantService } from '../services/restaurant.service';
import { ProductService } from '../services/product.service';

@Component({
    selector: 'app-restaurant-detail',
    templateUrl: './restaurant-detail.page.html',
    styleUrls: ['./restaurant-detail.page.sass'],
})
export class RestaurantDetailPage implements OnInit {

    restaurantTitle: string;
    restaurantImage: string;
    private productId: string;
    private restaurantId: string;

    private restaurant: Restaurant;
    private products: Product[];
    private isLoading: boolean;

    today = new Date().toISOString();

    constructor(
        private route: ActivatedRoute,
        private restaurantService: RestaurantService,
        private productService: ProductService
    ) {}

    ngOnInit() {
        this.isLoading = true;

        this.restaurantId = this.route.snapshot.paramMap.get('restaurantId');

        this.restaurantService.getRestaurant(this.restaurantId).subscribe(restaurant => {
            this.restaurant = restaurant;
            this.restaurantTitle = restaurant.title;
            this.restaurantImage = restaurant.image;

            this.productService.getProducts(this.restaurantId).subscribe(products => {
                this.products = products;
                this.isLoading = false;
            });
        });

    }


}
