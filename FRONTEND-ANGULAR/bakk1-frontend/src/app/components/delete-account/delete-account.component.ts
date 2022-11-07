import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import bckConfig from '../../configuration/backend-config.json';
import { User } from 'src/app/models/user.model';
import { PasswordHashingService } from 'src/app/services/password-hashing.service';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.scss'],
})
export class DeleteAccountComponent implements OnInit {
  private userId: string;

  private loginNavigation: string[] = ['/login'];

  private dashNavigation: string[] = ['/dash'];

  constructor(
    private hashingService: PasswordHashingService,
    private httpClient: HttpClient,
    private router: Router
  ) {
    this.userId = '';
    this.successMessage = '';
    this.user = {} as User;
    this.validateUser();
    this.myForm = new FormGroup({
      password: new FormControl(null, Validators.required),
    });
  }

  public myForm: FormGroup;

  public user: User;

  public successMessage: string;

  public ngOnInit(): void {}

  public deleteAccount() {
    this.getUser(this.userId);
    var password = this.myForm.get('password')?.value;
    console.log(this.user.password);
    var match = this.hashingService.isValid(password, this.user.password);

    if (!match) {
      this.successMessage = 'The password does not match!';
      return;
    }

    if (this.myForm.valid) {
      this.successMessage = '';
      this.httpClient
        .delete(
          `http://${bckConfig.server}:${bckConfig.port}/api/users/${this.user.id}`
        )
        .subscribe({
          error: (error) => {
            this.successMessage = error.error.error;
          },
          complete: () => {
            this.router.navigate(this.loginNavigation);
          },
        });
    }
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
      });
  }

  public isValid(controlName: string) {
    return (
      this.myForm.controls[controlName].invalid &&
      this.myForm.controls[controlName].touched
    );
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

  public moveToHome() {
    this.router.navigate(this.dashNavigation);
  }
}
