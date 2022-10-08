import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IPromoCode } from 'src/app/shared/models/promoCode';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-promo-codes',
  templateUrl: './promo-codes.component.html',
  styleUrls: ['./promo-codes.component.scss']
})
export class PromoCodesComponent implements OnInit {
  formPromoCode: FormGroup;
  allPromoCodes$: Observable<IPromoCode[]>;

  constructor(private adminService: AdminService, private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.createForm();
    this.adminService.getAllPromoCodes();
    this.allPromoCodes$ = this.adminService.promoCodes$;
  }
  async createForm() {
    this.formPromoCode = this.fb.group({
      Code: [''],
      ValidTo: [''],
      Status: ['']
    })
  }
  onSubmit() {
    this.adminService.createNewPromo(this.formPromoCode.get('Code').value, this.formPromoCode.get('ValidTo').value, this.formPromoCode.get('Status').value);
    this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/admin/promoCodes']);
  }); 
  }
  removeCode(code: string) {
    this.adminService.removePromoCode(code);
    this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/admin/promoCodes']);
  });
  }
  getBackgroundColor(status: string) {
    let color;
    if (status === "Free" || status === " free") {
      color = 'Aquamarine';
    } else if (status === "Forever" || status === " forever") {
      color = 'DarkSlateGray';
    } else {
      color = 'DarkRed';
    }
    return color;
  }
}
