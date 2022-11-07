import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import bckConfig from '../../configuration/backend-config.json';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss'],
})
export class UpdateProfileComponent implements OnInit {
  private userId: string;

  private loginNavigation: string[] = ['/login'];

  private dashNavigation: string[] = ['/dash'];

  constructor(private httpClient: HttpClient, private router: Router) {
    this.myForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      cnfpass: new FormControl(null, this.passValidator),
    });
    this.userId = '';
    this.successMessage = '';
    this.user = {} as User;
    this.validateUser();
  }

  public myForm: FormGroup;

  public successMessage: string;

  public user: User;

  public ngOnInit(): void {}

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

  public validateUser() {
    var tokenValue = localStorage.getItem('token');
    return this.httpClient
      .get(`http://${bckConfig.server}:${bckConfig.port}/api/users/userid`, {
        params: new HttpParams().append('token', tokenValue!),
      })
      .subscribe({
        next: (data) => {
          this.userId = data.toString();
          this.getUser(this.userId);
        },
        error: (error) => {
          this.router.navigate(this.loginNavigation);
        },
      });
  }

  public getUser(userId: string) {
    this.httpClient
      .get<User>(
        `http://${bckConfig.server}:${bckConfig.port}/api/users/get-user`,
        {
          params: new HttpParams().append('id', userId!),
        }
      )
      .subscribe({
        next: (data) => {
          this.user = data;
        },
        error: (error) => {
          this.successMessage = error.error.error;
        },
        complete: () => {
          this.myForm.setValue({
            username: this.user.username,
            email: this.user.email,
            password: '',
            cnfpass: '',
          });
        },
      });
  }

  public update() {
    this.getUser(this.userId);
    if (this.myForm.valid) {
      var username = this.myForm.get('username')?.value;
      var password = this.myForm.get('password')?.value;
      var email = this.myForm.get('email')?.value;
      var toUpdate = {
        id: this.user.id,
        username: username,
        password: password,
        email: email,
        creationdt: this.user.creationdt,
      } as User;
      this.httpClient
        .put(
          `http://${bckConfig.server}:${bckConfig.port}/api/users/edit`,
          toUpdate
        )
        .subscribe({
          next: (data) => {
            this.successMessage = 'Update was successful!';
            this.user.username = username;
            this.moveToHome();
          },
          error: (error) => {
            console.log(error);
            this.successMessage = error.error.error;
          },
        });
    }
  }

  public moveToHome() {
    this.router.navigate(this.dashNavigation);
  }
}
