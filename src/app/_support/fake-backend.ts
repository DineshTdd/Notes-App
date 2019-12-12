import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

// array in local storage for registered users
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUserId = '';
let notesList = JSON.parse(localStorage.getItem('notesList')) || [];
let todoList = JSON.parse(localStorage.getItem('todoList')) || [];
localStorage.setItem('notesList', JSON.stringify(notesList));

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;
        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize())
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/users/register') && method === 'POST':
                    return register();
                case url.endsWith('/users') && method === 'GET':
                    return getUsers();
                case url.match(/\/users\/\d+$/) && method === 'DELETE':
                    return deleteUser();
                case url.endsWith('/notes/create') && method === 'POST':
                    return addNote();
                case url.endsWith('/todo/'):
                    if (method === 'POST') {
                        return addTodo();
                    } else if (method === 'GET') {
                        return getTodo();
                    }
                    break;
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }
        }

        // route functions

        function authenticate() {
            const { username, password } = body;
            const user = users.find(x => x.username === username && x.password === password);
            if (!user) {
                return error('Username or password is incorrect'); }
            return ok({
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                token: 'fake-jwt-token'
            });
        }

        function register() {
            const user = body;

            if (users.find(x => x.username === user.username)) {
                return error('Username "' + user.username + '" is already taken');
            }

            user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
            users.push(user);
            localStorage.setItem('users', JSON.stringify(users));

            return ok();
        }

        function getUsers() {
            if (!isLoggedIn()) {
                return unauthorized();
            }
            return ok(users);
        }

        function deleteUser() {
            if (!isLoggedIn()) {
                return unauthorized();
            }

            users = users.filter(x => x.id !== idFromUrl());
            localStorage.setItem('users', JSON.stringify(users));
            return ok();
        }

        function addNote() {
            const { title, note, image } = body;
            currentUserId = JSON.parse(localStorage.getItem('currentUser')).id || '';
            if (!isLoggedIn() || currentUserId === '' ) {
                return unauthorized();
            }
            const notes = {
                id: 0,
                title,
                note,
                image
            };
            if (!notesList.find(x => x.id === currentUserId)) {
                const notesUser = {
                    id: currentUserId,
                    userNotes: []
                };
                notesList.push(notesUser);
                if (notesList.length > 0) {
                    notesList.sort((a: { id: number; }, b: { id: number; }) => (a.id > b.id) ? 1 : -1);
                }
            }
            const index = notesList.findIndex(x => x.id === currentUserId);
            const userNotesLen = notesList[index].userNotes.length;
            notes.id =  userNotesLen > 0 ?  userNotesLen : 0;
            notesList[index].userNotes.push(JSON.stringify(notes));
            localStorage.setItem('notesList', JSON.stringify(notesList));

            return ok(body);
        }

        function getTodo() {
            currentUserId = JSON.parse(localStorage.getItem('currentUser')).id || '';
            if (!isLoggedIn() || currentUserId === '' ) {
                return unauthorized();
            }
            todoList = JSON.parse(localStorage.getItem('todoList'));
            const index = todoList.findIndex(x => x.id === currentUserId);
            return ok(todoList[index].userTodos);
        }

        function addTodo() {
            const { todo } = body;
            currentUserId = JSON.parse(localStorage.getItem('currentUser')).id || '';
            if (!isLoggedIn() || currentUserId === '' ) {
                return unauthorized();
            }
            if (!todoList.find(x => x.id === currentUserId)) {
                const todoUser = {
                    id: currentUserId,
                    userTodos: []
                };
                todoList.push(todoUser);
                if (todoList.length > 0) {
                    todoList.sort((a: { id: number; }, b: { id: number; }) => (a.id > b.id) ? 1 : -1);
                }
            }
            const index = todoList.findIndex(x => x.id === currentUserId);
            todoList[index].userTodos.push(todo);
            localStorage.setItem('todoList', JSON.stringify(todoList));

            return ok(body);
        }

        // helper functions

        // tslint:disable-next-line: no-shadowed-variable
        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }));
        }

        function error(message) {
            return throwError({ error: { message } });
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1], 10);
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
