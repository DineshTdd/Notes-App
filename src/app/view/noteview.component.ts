import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../_services/authentication.service';

@Component({ templateUrl: 'noteview.component.html', styleUrls: ['noteview.component.css'] })
export class NoteViewComponent implements OnInit {
    id: number;
    notes: any;
    notesList: any;
    lenempty: any;
    constructor(private authenticationService: AuthenticationService) {
        this.id = this.authenticationService.currentUserValue.id;
        this.lenempty = false;
    }

    ngOnInit() {
        this.notes = JSON.parse(localStorage.getItem('notesList'));
        const index = this.notes.findIndex(x => x.id === this.id);
        if (index >= 0) {
            this.notesList = this.notes[index].userNotes.map(x => JSON.parse(x) );
        } else {
            this.lenempty = true;
        }
    }


}
