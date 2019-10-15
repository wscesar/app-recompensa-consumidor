import { Component, OnInit } from '@angular/core';
import { BarcodeScannerOptions, BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { take } from 'rxjs/operators';
import { AlertController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scan-voucher',
  templateUrl: 'scan-voucher.page.html',
})
export class ScanVoucherPage implements OnInit {
    isLoading = true;
    userId = this.authService.getUserId();
    barcodeScannerOptions: BarcodeScannerOptions;
    encodeData: any;
    scannedData: {};
    newScore: number;
    restaurantId: string;
    scannedScore: number;
    currentScore: number;

    constructor(
        private navCtrl: NavController,
        private authService: AuthService,
        private userService: UserService,
        private alertCtrl: AlertController,
        private barcodeScanner: BarcodeScanner
    ) {}

    ngOnInit() {
        this.encodeData = 'http://github.com/wscesar';

        this.barcodeScannerOptions = {
            showTorchButton: true,
            showFlipCameraButton: true
        };

        this.scanCode();
    }

    scanCode() {
        this.isLoading = true;
        console.log(this.userId);
        this.barcodeScanner.scan()
            .then(barcodeData => {

                const splitData = barcodeData.text.split('-');

                if (splitData.length < 1) {
                    alert('invalid code');
                    return;
                }

                this.restaurantId = splitData[0];
                this.scannedScore = +splitData[1];

                this.userService
                    .getUserScore(this.restaurantId, this.userId)
                    .pipe( take(1) )
                    .subscribe( res => {
                        // let newScore: any;
                        // const currentScore = res.score;
                        this.currentScore = res.score;
                        if (this.currentScore !== undefined && this.currentScore !== null) {
                            this.newScore = this.currentScore + this.scannedScore;
                        } else {
                            this.newScore = 0;
                        }

                        this.userService
                            .updateUserScore(this.restaurantId, this.userId, {score: this.newScore})
                            .then( () => {
                                this.isLoading = false;
                                this.scannedData = barcodeData;
                                this.showAlert();
                            })
                            .catch( err => {
                                this.isLoading = false;
                                alert('catch: ' + err);
                            });
                    });

            })
            .catch(err => {
                this.isLoading = false;
                alert('catch 2: ' + err);
            });
    }

    encodedText() {
        this.barcodeScanner
            .encode(this.barcodeScanner.Encode.TEXT_TYPE, this.encodeData)
            .then(
                encodeData => {
                    console.log(encodeData);
                    this.encodeData = encodeData;
                },
                err => {
                    console.log('Error ocurred:', err);
                }
            );
    }

    showAlert() {
        this.alertCtrl.create({
            header: 'Sucesso',
            message: 'Você recebeu ' + this.scannedScore + ' pontos',
            buttons: [
                {
                    text: 'Ok',
                    handler: () => {
                        this.navCtrl.navigateBack('/restaurantes');
                    }
                },
            ]
        }).then(alertEl => {
            alertEl.present();
        });
    }

}
