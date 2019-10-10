import { Component, OnInit } from '@angular/core';
import { Restaurant } from '../model/restaurant.model';
import { RestaurantService } from '../services/restaurant.service';

@Component({
  selector: 'app-restaurant-list',
  templateUrl: './restaurant-list.page.html'
})
export class RestaurantListPage implements OnInit {
    private restaurants: Restaurant[];
    private isLoading = true;

    constructor(
        private restaurantService: RestaurantService
    ) {}

    ngOnInit() {
        this.restaurantService.getRestaurants().subscribe(restaurants => {
            this.restaurants = restaurants;
            this.isLoading = false;
        });
    }

}
