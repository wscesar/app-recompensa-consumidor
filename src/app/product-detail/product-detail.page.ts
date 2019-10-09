import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Restaurant } from '../model/restaurant.model';
import { Product } from '../model/product.model';
import { User } from '../model/user.model';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { ProductService } from '../services/product.service';
import { AlertController } from '@ionic/angular';
import { Voucher } from '../model/voucher.model';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.sass']
})
export class ProductDetailPage implements OnInit {

    private isLoading = true;
    private disableButton = false;

    private userId: string;
    private productId: string;
    private restaurantId: string;

    private user: User;
    private product: Product;
    private vouchers: Voucher[];

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private alertCtrl: AlertController,
        private productService: ProductService,
        private route: ActivatedRoute) {}

    ngOnInit() {
        this.userId = this.authService.getUserId();
        this.productId = this.route.snapshot.paramMap.get('productId');

        this.getVouchers(this.userId, this.productId);

        this.productService.getProduct(this.productId).subscribe( product => {
            this.product = product;
            this.restaurantId = product.restaurantId;

            this.userService.getUser(this.userId).subscribe( user => {
                this.user = user;
                this.toggleButton();
                this.isLoading = false;
            });
        });
    }


    toggleButton() {
        if (this.user.score < this.product.price) {
            this.disableButton = true;
        }
    }


    useVoucher() {
        const uScore =  this.user.score;
        const pScore =  this.product.price;

        if ( uScore >= pScore ) {
            this.user.score = uScore - pScore;

            this.userService
                    .updateUserScore(this.userId, this.user.score)
                    .then( () => {
                        if (this.user.score < this.product.price) {
                            this.disableButton = true;
                        }

                        this.createVoucher();
                    });

        } else {
            this.disableButton = true;
        }

    }


    getVouchers(userId: string, productId: string) {
        this.productService.getVouchers(userId, productId).subscribe(res => {
            this.vouchers = res;
        });
    }


    createVoucher() {
        const voucherId = Math.random().toString(36).substr(2, 9);

        const voucher = new Voucher(
            voucherId,
            this.restaurantId,
            this.productId,
            this.userId,
        );

        this.productService.createVoucher(voucher).then(res => {
            this.showVoucherId(voucherId);
        });

    }


    showVoucherId(voucherId: string) {
        this.alertCtrl.create({
            header: 'Sucesso',
            subHeader: voucherId,
            message: 'Para resgatar seu produto informe o codigo acima para o garçom',
            buttons: ['OK']
        }).then(alertEl => {
            alertEl.present();
            this.getVouchers(this.userId, this.productId);
        });
    }


    showAlert() {
        this.alertCtrl.create({
            header: 'Resgatar Produto',
            message: 'Essa operação não pode ser desfeita',
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                },
                {
                    text: 'Ok',
                    handler: () => {
                        this.useVoucher();
                    }
                },
            ]
        }).then(alertEl => {
            alertEl.present();
        });
    }

}
