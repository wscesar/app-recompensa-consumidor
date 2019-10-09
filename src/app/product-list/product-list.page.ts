import { Component, OnInit } from '@angular/core';
import { Product } from '../model/product.model';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
})
export class ProductListPage implements OnInit {

    private products: Product[];
    private isLoading = true;

    constructor(
        private productService: ProductService
    ) {}

    ngOnInit() {
        this.productService.getAllProducts().subscribe(products => {
            this.isLoading = false;
            this.products = products;
        });
    }

}
