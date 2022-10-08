import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/models/basket';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-allbaskets',
  templateUrl: './allbaskets.component.html',
  styleUrls: ['./allbaskets.component.scss']
})
export class AllbasketsComponent implements OnInit {
  allBaskets$: Observable<IBasket[]>;
  constructor(private adminService: AdminService, private basketServise: BasketService, private router: Router) { }

  ngOnInit(): void {
    this.adminService.getBaskets();
    this.allBaskets$ = this.adminService.allBaskets$
  }

  async deleteBasket(basket: IBasket) {
    await this.basketServise.deleteBasket(basket);
    this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/admin/allbaskets']);
  }); 
    
  }
}
