import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

    private userId: string = this.authService.getUserId();
    private productId: string = this.route.snapshot.paramMap.get('productId');
    private restaurantId: string = this.route.snapshot.paramMap.get('restaurantId');

    private user: User;
    private userScore = 0;
    private product: Product;
    private vouchers: Voucher[];

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private alertCtrl: AlertController,
        private productService: ProductService,
        private route: ActivatedRoute) {}

    ngOnInit() {

        this.getVouchers(this.userId, this.restaurantId, this.productId);

        this.userService
            .getUserScore(this.restaurantId, this.userId)
            .subscribe(res => {
                if (res !== undefined) {
                    this.userScore =  res.score;
                }
            });

        this.productService
            .getProduct(this.restaurantId, this.productId)
            .subscribe( product => {
                this.product = product;

                this.userService.getUser(this.userId).subscribe( user => {
                    this.user = user;
                    this.toggleButton();
                    this.isLoading = false;
                });
            });

    }


    toggleButton() {
        if (this.userScore < this.product.price) {
            this.disableButton = true;
        }
    }


    getVouchers(userId: string, restaurantId: string, productId: string) {
        this.productService
            .getVouchers(userId, restaurantId, productId)
            .subscribe(res => {
                this.vouchers = res;
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
            this.getVouchers(this.userId, this.restaurantId, this.productId);
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

    useVoucher() {
        const uScore =  this.userScore;
        const pScore =  this.product.price;

        if ( uScore >= pScore ) {

            this.userScore = uScore - pScore;

            this.userService
                .updateUserScore(this.restaurantId, this.userId, this.userScore)
                .then( () => {
                    this.toggleButton();
                    this.createVoucher();
                });

        } else {
            this.disableButton = true;
        }

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

}
