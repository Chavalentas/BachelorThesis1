import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import bckConfig from '../../configuration/backend-config.json';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  private registerNavigation: string[] = ['/register'];

  private dashboardNavigation: string[] = ['/dash'];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private httpClient: HttpClient
  ) {
    this.loginForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    });
  }

  public loginForm: FormGroup;
  public successMessage: String = '';

  public ngOnInit() {}

  public isValid(controlName: any) {
    return (
      this.loginForm.controls[controlName].invalid &&
      this.loginForm.controls[controlName].touched
    );
  }

  public login() {
    if (this.loginForm.valid) {
      this.httpClient
        .post(
          `http://${bckConfig.server}:${bckConfig.port}/api/users/login`,
          this.loginForm.value
        )
        .subscribe({
          next: (data) => {
            localStorage.setItem('token', data.toString());
            this.router.navigate(this.dashboardNavigation);
          },
          error: (error) => {
            {
              this.successMessage = error.error.error;
            }
          },
        });
    }
  }

  public movetoregister() {
    this.router.navigate(this.registerNavigation);
  }
}
