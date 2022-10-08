import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ICategory } from 'src/app/shared/models/category';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  category$: Observable<ICategory[]>;
  changeForm: FormGroup;
  formData = new FormData;
  
  constructor(private router: Router, private fb: FormBuilder, private adminService: AdminService) { }

  ngOnInit(): void {
  this.createCategoryForm()
  this.adminService.getCategorys();
  this.category$ = this.adminService.category$;
  }
  async removeCategory(category: ICategory) {
    await this.adminService.deleteCategory(category.id).subscribe((resp) => {
      this.adminService.getCategorys();
    }), error => {
      console.log(error)
    }
  }
  async createCategoryForm() {

    this.changeForm = this.fb.group({
      Name: [''],
      File: [''],
    })
  }
  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const _file = event.target.files[0];
      this.formData.append('File', _file);
    }
  }
  createFormData() {
    this.formData.append('Name', this.changeForm.value.Name);
  }
  onSubmit(): void {
    this.createFormData()
    this.adminService.createCategory(this.formData).subscribe(response => {
      this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/admin/category']);
      });
    }, error => {
      console.log(error);
    })
  }
}
