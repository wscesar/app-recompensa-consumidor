import { Component, OnInit } from '@angular/core';
import { BarcodeScannerOptions, BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { AlertController, NavController } from '@ionic/angular';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-qrcode-scanner',
  templateUrl: 'qrcode-scanner.page.html',
})
export class QRCodeScannerPage implements OnInit {
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
        this.barcodeScannerOptions = {
            showTorchButton: true,
            showFlipCameraButton: true
        };
    }

    // ionViewWillEnter() {
    //     this.scanCode();
    // }

    teste: string;

    scanCode() {
        this.isLoading = true;
        this.barcodeScanner.scan()
            .then(barcodeData => {

                this.scannedData = barcodeData;

                const splitData = barcodeData.text.split('-');
                this.restaurantId = splitData[0];
                this.scannedScore = +splitData[1];
                this.teste = splitData[2];

                this.userService.getGeneratedCodes(this.teste).subscribe( res => {
                    if (res[0] === undefined) {
                        this.addGeneratedCode();
                    } else if (res[0].id === this.teste) {
                        alert('codigo ja adicionado');
                    }
                });

            });
    }

    addGeneratedCode() {
        this.userService.addGeneratedCode(this.teste).then( () => {
            this.getUserScore();
        });
    }

    getUserScore() {
        this.userService
            .getUserScore(this.restaurantId, this.userId)
            .pipe( take(1) )
            .subscribe( userScore => {

                this.currentScore = userScore.score;

                if (this.currentScore >= 0) {
                    this.newScore = this.currentScore + this.scannedScore;
                } else {
                    this.newScore = 0;
                }

                this.updateUserScore();

            });
    }

    updateUserScore() {
        this.userService
            .updateUserScore(this.restaurantId, this.userId, this.newScore)
            .then( () => {
                this.isLoading = false;
                this.showAlert();
            });
    }

    showAlert() {
        this.alertCtrl.create({
            header: 'Sucesso',
            message: 'Você recebeu ' + this.scannedScore + ' pontos',
            buttons: [
                {
                    text: 'Ok',
                    handler: () => {
                        // this.navCtrl.navigateBack('/restaurantes');
                    }
                },
            ]
        }).then(alertEl => {
            alertEl.present();
        });
    }

}
