import {Component, inject, input, output, signal} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Avatar} from '../ui/avatar/avatar';
import {AppStore} from '../../services/auth-service/auth.store';
import {LoadingBar} from '../loading-bar/loading-bar';

type EditorMode = 'postCreation' | 'commentCreation';

@Component({
  selector: 'app-post-editor',
  standalone: true,
  imports: [
    Avatar,
    FormsModule,
    ReactiveFormsModule,
    LoadingBar
  ],
  templateUrl: './post-editor.html',
  styleUrl: './post-editor.scss',
})
export class PostEditor {
  mode = input<EditorMode>('postCreation'); // 'create' | 'edit'
  placeholder = input<string>('placeholder');
  submitLabel = input<string>('submit');
  initialText = input<string>('');
  enableImage = input<boolean>(true);
  currentUser = inject(AppStore).user()

  submitted = output<any>();
  isLoading = signal(false);
  imagePreview = signal<string | ArrayBuffer | null>(null);
  selectedImageUrl = signal<string | null>(null)

  form = new FormGroup({
    contentText: new FormControl('', [Validators.required]),
    contentImage: new FormControl(''),
    createdAt: new FormControl(new Date()),
    likes: new FormControl(0),
    comments: new FormControl(0),
    reposts: new FormControl(0),
    views: new FormControl(0),
    replyAllowed: new FormControl(true),
  });

   ngOnInit() {
     this.form.patchValue({contentText: this.initialText()})
   }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const fileForPreview = (event.target as HTMLInputElement).files?.[0];
    this.selectedImageUrl.set(file.name)
    if(fileForPreview) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview.set(reader.result);
      };
      reader.readAsDataURL(fileForPreview);
    }
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.form.patchValue({ contentImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  }

   removeSelectedImage() {
      this.form.patchValue({ contentImage: '' });
      this.imagePreview.set(null);
      this.selectedImageUrl.set(null);
   }

   onSubmit() {
     if(this.form.invalid) return;
     this.isLoading.set(true)
     const payload = {
       ...this.form.value,
       author: this.currentUser(),
       createdAt: new Date()};

     this.submitted.emit(payload)
     this.isLoading.set(false)

     this.form.reset({
       contentText: '',
       contentImage: '',
       createdAt: new Date(),
     })

     this.removeSelectedImage()
   }
}
