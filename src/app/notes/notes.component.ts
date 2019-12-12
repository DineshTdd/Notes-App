import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { NotesService } from '../_services/notes.service';



@Component({ templateUrl: 'notes.component.html', styleUrls: ['notes.component.css'] })
export class NotesComponent implements OnInit {
    noteForm: FormGroup;
    isLoading = false;
    isSubmitted = false;
    image: any;
    isInvalidImage = false;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private notesService: NotesService,
    ) { }

    ngOnInit() {
        this.noteForm = this.formBuilder.group({
            title: ['', Validators.required],
            note: ['', Validators.required],
            uploadImage: ['', Validators.required]
        });
    }

    get f() { return this.noteForm.controls; }

    getImage(event) {
        this.isInvalidImage = false;
        const reader = new FileReader();
        localStorage.setItem('imgData', null);
        if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);
        reader.onload = () => {
            const img = reader.result.toString();
            if (img.match(/^data:image\/(png|jpg|jpeg|gif);base64,/)) {
                this.image = img;
            } else {
                this.isInvalidImage = true;
                return;
            }
        };
        // this.formGroup.patchValue({
        //     file: reader.result
        //  });
        }

    }

    deleteImage() {
        this.image = '';
    }

    onSubmit() {
        this.isSubmitted = true;


        // stop here if form is invalid
        if (this.noteForm.invalid) {
            return;
        }

        this.isLoading = true;
        this.notesService.addNote(this.f.title.value, this.f.note.value, this.image)
            .pipe(first())
            .subscribe(
                data => {
                    console.log('returned from backend');
                    alert('Note added successfully!');
                    this.router.navigate(['**']);
                },
                error => {
                    this.isLoading = false;
                });
    }

}







