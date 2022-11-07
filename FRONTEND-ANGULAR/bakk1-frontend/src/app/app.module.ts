import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { DeleteAccountComponent } from './components/delete-account/delete-account.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { RegisterComponent } from './components/register/register.component';
import { UpdateProfileComponent } from './components/update-profile/update-profile.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PasswordHashingService } from './services/password-hashing.service';

@NgModule({
  declarations: [
    AppComponent,
    AlertDialogComponent,
    DeleteAccountComponent,
    LoginComponent,
    RegisterComponent,
    UpdateProfileComponent,
    UserDashboardComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTableModule,
    MatMenuModule,
  ],
  providers: [PasswordHashingService],
  bootstrap: [AppComponent],
})
export class AppModule {}
