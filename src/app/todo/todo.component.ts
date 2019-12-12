import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NotesService } from '../_services/notes.service';
import { first } from 'rxjs/operators';

@Component({
    templateUrl: 'todo.component.html',
    styleUrls: ['todo.component.css']
})
export class TodoComponent implements OnInit {
    todoForm: FormGroup;
    isInputError: any;
    todoList: any;

    constructor(
        private formBuilder: FormBuilder,
        private notesService: NotesService,
        private router: Router) {
        this.isInputError = false;
        this.getTodo();
    }

    ngOnInit() {
        this.todoForm = this.formBuilder.group({
            todo: ['', Validators.required]
        });
        this.getTodo();
    }

    get f() { return this.todoForm.controls; }

    getTodo() {
        this.notesService.getTodoList()
        .pipe(first())
        .subscribe(
            async data => {
                this.todoList = data;
                await this.todoList.reverse();
            },
            error => {
                console.log('Fetching failed!');
            });
    }


    addTodo(todo: string) {
        if (todo.trim().length === 0) {
            this.isInputError = true;
            return;
        }
        this.isInputError = false;
        this.notesService.addToTodoList(todo)
        .pipe(first())
        .subscribe(
            data => {
                console.log('returned from backend');
                alert('Todo added successfully!');
                this.router.navigate(['/todo']);
            },
            error => {
                alert('Todo wasn\'t added successfully!');
            });
    }
}
