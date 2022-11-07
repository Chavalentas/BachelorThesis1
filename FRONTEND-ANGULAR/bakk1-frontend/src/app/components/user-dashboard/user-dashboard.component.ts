import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import bckConfig from '../../configuration/backend-config.json';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss'],
})
export class UserDashboardComponent implements OnInit {
  @ViewChild(MatTable) myTable!: MatTable<any>;

  private loginNavigation: string[] = ['/login'];

  private changeProfileNavigation: string[] = ['/update-profile'];

  private deleteProfileNavigation: string[] = ['/user-delete'];

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.user = {} as User;
    var tokenValue = localStorage.getItem('token');
    this.httpClient
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

  public user: User;

  public userId = '';

  public ngOnInit() {}

  public changeProfile() {
    this.router.navigate(this.changeProfileNavigation);
  }

  public deleteProfile() {
    this.router.navigate(this.deleteProfileNavigation);
  }

  public logout() {
    localStorage.removeItem('token');
    this.router.navigate(this.loginNavigation);
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
        },
        error: (error) => {
          this.dialog.closeAll();
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
      });
  }
}
