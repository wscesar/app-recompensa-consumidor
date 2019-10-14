import { Component, OnInit } from '@angular/core';
import { Restaurant } from '../model/restaurant.model';
import { RestaurantService } from '../services/restaurant.service';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-restaurant-list',
  templateUrl: './restaurant-list.page.html'
})
export class RestaurantListPage implements OnInit {
    private restaurants: Restaurant[];
    private isLoading = true;
    private userId =  this.authService.getUserId();

    constructor(
        // private qrScanner: QRScanner,
        private restaurantService: RestaurantService,
        private userService: UserService,
        private authService: AuthService
    ) {}

    ngOnInit() {

        this.restaurantService.getRestaurants().subscribe(restaurants => {
            this.restaurants = restaurants;

            for (const restaurant of restaurants) {

                this.userService.getUserScore(restaurant.id, this.userId).subscribe( res => {
                    if (res !== undefined) {
                        restaurant.userScore = res.score;
                    } else {
                        restaurant.userScore = 0;
                    }
                });

            }

            this.isLoading = false;
        });

    }

}
