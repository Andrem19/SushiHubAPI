import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CheckoutService } from 'src/app/checkout/checkout.service';
import { IPointInfo } from 'src/app/shared/models/pointInfo';
import { ISquare } from 'src/app/shared/models/squares';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-squares',
  templateUrl: './squares.component.html',
  styleUrls: ['./squares.component.scss']
})
export class SquaresComponent implements OnInit {
allSquares$: Observable<ISquare[]>;
squareCheck$: Observable<IPointInfo>;

formSquare: FormGroup;
addressForm: FormGroup;

  constructor(private checkoutService: CheckoutService, private adminService: AdminService, private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.createChangeForm();
    this.createAddressForm();
    this.adminService.getAllSquares()
    this.allSquares$ = this.adminService.squares$;

  }
  async removeSquare(id: string) {
    await this.adminService.deleteSquare(id);
    this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/admin/squares']);
  }); 
  }
  async createChangeForm() {
    this.formSquare = this.fb.group({
      Point: [''],
      City: [''],
      Street: [''],
      House: [''],
      PostCode: [''],
      DeliveryCost: [''],
      FreeZone: [false],
      LatN: [''],
      LatS: [''],
      LonW: [''],
      LonE: [''],
    })
  }
  CheckAddress() {
    this.checkoutService.checkLocation(this.addressForm.value);
    this.squareCheck$ = this.checkoutService.point$;
  }
  createAddressForm() {
    this.addressForm = this.fb.group({
      name: [null, Validators.required],
      numberOfHouse: [null, Validators.required],
      street: [null, Validators.required],
      city: [null, Validators.required],
      postCode: [null, Validators.required],
      telephoneNumber: [null, Validators.required],
    })
  }
  async onSubmit() {
    await this.adminService.addSquare(this.formSquare.value);
    this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/admin/squares']);
  }); 
  }
}
