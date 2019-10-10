import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';

import { Product } from '../model/product.model';
import { AuthService } from './auth.service';
import { UiManagerService } from './ui-manager.service';
import { Voucher } from '../model/voucher.model';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

    constructor(
        private uiManager: UiManagerService,
        private firebase: AngularFirestore,
        private authService: AuthService ) {}

    // updateProductImage(productId: string, imageUrl: string) {
    //     return this.firebase.collection('products').doc(productId).update({image: imageUrl})
    // }

    getProducts(restaurantId: string) {
        return this.firebase
                    // .collection('products', ref => ref.where('restaurantId', '==', restaurantId))
                    .collection<Product>('restaurants/' + restaurantId + '/products')
                    // .order(by: 'random')
                    .snapshotChanges()
                    .pipe (
                        map ( ( docArray: DocumentChangeAction<any>[] ) => {
                            return docArray.map( ( doc: DocumentChangeAction<any> ) => {
                                const data: Product = doc.payload.doc.data();
                                const id = doc.payload.doc.id;
                                return {...data, id};
                            });
                        }),
                    );
    }

    getProduct(restaurantId: string, productId: string) {
        return this.firebase
                    // .doc<Product>('products/' + productId)
                    .doc<Product>('restaurants/' + restaurantId + '/products/' + productId)
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

    createVoucher(voucher: Voucher) {
        return this.firebase.collection('vouchers').add({...voucher});
    }

    getVouchers(userId: string, productId: string) {
        return this.firebase
                    .collection('vouchers', ref => ref.where('productId', '==', productId).where('userId', '==', userId))
                    .snapshotChanges()
                    .pipe (
                        map ( ( docArray: DocumentChangeAction<any>[] ) => {
                            return docArray.map( ( doc: DocumentChangeAction<any> ) => {
                                return doc.payload.doc.data();
                            });
                        }),
                    );
    }

}
