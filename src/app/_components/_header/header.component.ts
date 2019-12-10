import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../_services/authentication.service';
import { User } from '../../_model/user';

@Component({
    selector : 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})


export class HeaderComponent implements OnInit, OnDestroy {
    userIsAuthenticated = false;
    private authListenerSubs: Subscription;
    currentUser: User;
    name: string;
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService) {
            this.authenticationService.currentUser.subscribe(x => {
                this.currentUser = x;
                if (this.currentUser != null) {
                    this.userIsAuthenticated = true;
                } else {
                    this.userIsAuthenticated = false;
                }
            });
        }



    ngOnInit() {
        this.userIsAuthenticated = this.authenticationService.getIsAuth();
        this.authenticationService.currentUser.subscribe(x => {
            this.currentUser = x;
            this.name = this.currentUser.firstName;
            if (this.currentUser != null) {
                this.userIsAuthenticated = true;
            } else {
                this.userIsAuthenticated = false;
            }
        });
    }

    onLogout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }

    ngOnDestroy() {
        this.authListenerSubs.unsubscribe();
    }
}
