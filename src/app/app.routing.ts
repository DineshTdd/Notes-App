import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './_support/auth.guard';
import { NotesComponent } from './notes/notes.component';
import { NoteViewComponent } from './view/noteview.component';
import { TodoComponent } from './todo/todo.component';

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: SignupComponent },
    { path: 'notes-create', component: NotesComponent, canActivate: [AuthGuard]},
    { path: 'notes-view', component: NoteViewComponent, canActivate: [AuthGuard]},
    { path: 'todo', component: TodoComponent, canActivate: [AuthGuard]},

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const appRoutingModule = RouterModule.forRoot(routes);
