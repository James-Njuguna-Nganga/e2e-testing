import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { TopbarComponent } from "../global/topbar/topbar.component";
import { FooterComponent } from "../global/footer/footer.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TopbarComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  currentSlide = 0;
  slideInterval: any

  slides = [
    { 
      image: 'bg2.jpg',
      title: 'Fresh Harvest Daily', 
      text: 'Locally sourced vegetables and produce straight from the farm'
    },
    { 
      image: 'bg1.jpg',
      title: 'Supporting Local Farmers', 
      text: 'Connect directly with Kenyan farmers for the best agricultural products'
    },
    { 
      image: 'bg3.jpg',
      title: 'Quality Livestock Products', 
      text: 'Premium dairy and livestock products from certified farmers'
    }
  ];
  products: any[] = [];
  farmers: any[] = [];
  categories: any[] = [];

  constructor(
    public authService: AuthService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.startSlideShow();
  }

  loadProducts() {
    this.productService.getAllProducts(0, 3).subscribe(
      (data: any) => this.products = data
    );
  }

  startSlideShow() {
    this.slideInterval = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    }, 7000);
  }
  setCurrentSlide(index: number) {
    this.currentSlide = index;
    // Reset interval when manually changing slides
    clearInterval(this.slideInterval);
    this.startSlideShow();
  }
}

