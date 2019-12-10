import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class NotesService {
    private apiUrl: 'http://localhost:4200';
    constructor(private http: HttpClient) { }

    addNote(title: string, note: string, image?: string) {
        console.log('entering backend');
        return this.http.post(`${this.apiUrl}/notes/create`, {title, note, image});
    }
}
