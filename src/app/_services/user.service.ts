import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_model/user';

@Injectable({ providedIn: 'root' })
export class UserService {
    private apiUrl: 'http://localhost:4200';

constructor(private http: HttpClient) { }

getAll() {
        return this.http.get<User[]>(`${this.apiUrl}/users`);
    }

register(user: User) {
        return this.http.post(`${this.apiUrl}/users/register`, user);
    }


}
