import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import bckConfig from '../../configuration/backend-config.json';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  private loginNavigation: string[] = ['/login'];

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private activatedRoute: ActivatedRoute
  ) {
    this.myForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      cnfpass: new FormControl(null, this.passValidator),
    });

    this.myForm.controls['password'].valueChanges.subscribe((x) =>
      this.myForm.controls['cnfpass'].updateValueAndValidity()
    );
  }

  public myForm: FormGroup;
  public successMessage: String = '';

  public ngOnInit() {}

  public isValid(controlName: string) {
    return (
      this.myForm.controls[controlName].invalid &&
      this.myForm.controls[controlName].touched
    );
  }

  public passValidator(control: AbstractControl) {
    if (control && (control.value !== null || control.value !== undefined)) {
      const cnfpassValue = control.value;

      const passControl = control.root.get('password');
      if (passControl) {
        const passValue = passControl.value;
        if (passValue !== cnfpassValue || passValue === '') {
          return {
            isError: true,
          };
        }
      }
    }

    return null;
  }

  public register() {
    console.log(this.myForm.value);

    if (this.myForm.valid) {
      this.httpClient
        .post(
          `http://${bckConfig.server}:${bckConfig.port}/api/users/register`,
          this.myForm.value
        )
        .subscribe({
          next: (data) => {
            this.successMessage = 'Registration was successful!';
          },
          error: (error) => {
            this.successMessage = error.error.error;
          },
        });
    }
  }

  public movetologin() {
    this.router.navigate(this.loginNavigation);
  }
}
