import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';

import { Restaurant } from '../model/restaurant.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class RestaurantService {

    constructor(
        private firebase: AngularFirestore,
        private authService: AuthService
    ) {}

    updateRestaurant(restaurantId: string, restaurant: object) {
        return this.firebase.collection('restaurants').doc(restaurantId).update({...restaurant});
    }

    updateRestaurantImage(restaurantId: string, imageUrl: string) {
        return this.firebase.collection('restaurants').doc(restaurantId).update({image: imageUrl});
    }

    getRestaurants() {
        return this.firebase
                    .collection<Restaurant[]>('restaurants')
                    .snapshotChanges()
                    .pipe (
                        map ( ( docArray: DocumentChangeAction<any>[] ) => {
                            return docArray.map((doc: DocumentChangeAction<any>) => {
                                const data: Restaurant = doc.payload.doc.data();
                                const id = doc.payload.doc.id;
                                return { ...data, id };
                            });
                        }),
                    );
    }

    getRestaurant(restaurantId: string) {
        return this.firebase
                    .doc<Restaurant>('restaurants/' + restaurantId)
                    .snapshotChanges()
                    .pipe (
                        map ( doc => {
                            const data = doc.payload.data();
                            const id = doc.payload.id;
                            const products = null;
                            return { ...data, id, products };
                        })
                    );
    }



}
