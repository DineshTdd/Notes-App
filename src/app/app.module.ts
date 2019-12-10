import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { HeaderComponent } from './_components/_header/header.component';
import { AngularMaterialModule } from './angular-material.module';

import { fakeBackendProvider } from './_support/fake-backend';

import { appRoutingModule } from './app.routing';
import { JwtInterceptor } from './_support/jwt.interceptor';
import { ErrorInterceptor } from './_support/error.interceptor';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AlertComponent } from './_components/_alert/alert.component';
import { NotesComponent } from './notes/notes.component';
import { NoteViewComponent } from './view/noteview.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    AlertComponent,
    NotesComponent,
    NoteViewComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgbAlertModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    appRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // provider used to create fake backend
    fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
