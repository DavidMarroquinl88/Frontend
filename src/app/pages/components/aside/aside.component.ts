import { Component } from '@angular/core';
import { PrimengCommonModule } from '../../../shared/modules/primeng-common.module';
import { Router } from '@angular/router';

@Component({
  selector: 'pages-aside',
  imports: [PrimengCommonModule],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css'
})
export class AsideComponent {

  constructor(
    private router: Router
  ) {

  }

  onGoBranch() {
    this.router.navigate(['pages/branch']);
  }

  onGoStore() {
    this.router.navigate(['pages/store']);
  }

  onGoArticle(){
    this.router.navigate(['pages/article']);
  }

  onGoInventory(){
    this.router.navigate(['pages/inventory']);
  }

  onGoUser(){
    this.router.navigate(['pages/user']);
  }

  onGoShopping(){
    this.router.navigate(['pages/shopping']);
  }
}
