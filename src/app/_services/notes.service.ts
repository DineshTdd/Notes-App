import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class NotesService {
    private apiUrl: 'http://localhost:4200';
    constructor(private http: HttpClient) { }

    addNote(title: string, note: string, image?: string) {
        return this.http.post(`${this.apiUrl}/notes/create`, {title, note, image});
    }

    addToTodoList(todo: string) {
        return this.http.post(`${this.apiUrl}/todo/`, {todo});
    }

    getTodoList() {
        return this.http.get(`${this.apiUrl}/todo/`);
    }
}
