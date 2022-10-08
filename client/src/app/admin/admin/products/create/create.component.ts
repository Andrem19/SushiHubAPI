import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/admin/admin.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  changeForm: FormGroup;
  formData = new FormData;
  constructor(private fb: FormBuilder, private adminService: AdminService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.createCreateForm()
  }
  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const _file = event.target.files[0];
      this.formData.append('File', _file);
    }
  }
  createFormData() {
    this.formData.append('Name', this.changeForm.value.Name);
    this.formData.append('Price', this.changeForm.value.Price.toString());
    this.formData.append('Ingridients', this.changeForm.value.Ingridients);
    this.formData.append('productType', this.changeForm.value.Type);
    this.formData.append('popularity', this.changeForm.value.Popularity);
    this.formData.append('minutesToMake', this.changeForm.value.MinutesToMake.toString());
  }
  onSubmit(): void {
    console.log('start')
    this.createFormData()
    this.adminService.createProduct(this.formData).subscribe(response => {
      this.router.navigateByUrl('/admin/products');
    }, error => {
      console.log(error);
    })
  }
  async createCreateForm() {

    this.changeForm = this.fb.group({
      Name: [''],
      Ingridients: [''],
      Price: [''],
      File: [''],
      PictureUrl: [''],
      Type: [''],
      Popularity: [''],
      MinutesToMake: ['']
    })
  }
}
