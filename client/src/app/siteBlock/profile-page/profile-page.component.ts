import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { UserService } from './../../services/user.service';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  constructor(private userService: UserService, private router: Router) {}

  @ViewChild('input', { static: false }) inputRef: ElementRef;

  data: any;
  imageSrc: string;
  image: File;
  isAddPhoto = false;
  errMessage: string = null;

  fetchSub: Subscription;
  photoSub: Subscription;
  deleteSub: Subscription;
  form: FormGroup;

  ngOnInit(): void {
    this.form = new FormGroup({});
    this.form.disable();

    this.fetchSub = this.userService.fetchData().subscribe(
      ({ user }) => {
        this.imageSrc = user.imageSrc;
        delete user.imageSrc;

        this.data = Object.entries(user);
      },
      (err) => (this.errMessage = err.error.message)
    );
  }

  ngOnDestroy() {
    if (this.fetchSub) {
      this.fetchSub.unsubscribe();
    }

    if (this.deleteSub) {
      this.deleteSub.unsubscribe();
    }

    if (this.photoSub) {
      this.photoSub.unsubscribe();
    }
  }

  triggerClick() {
    this.inputRef.nativeElement.click();
  }

  onFileUpload(event: any) {
    const file = event.target.files[0];
    this.image = file;
    this.form.enable();
  }

  onAddPhoto() {
    this.form.disable();
    this.photoSub = this.userService.addPhoto(this.image).subscribe(
      ({ user }) => (this.imageSrc = user.imageSrc),
      (err) => (this.errMessage = err.error.message)
    );
  }

  deleteAcc() {
    this.deleteSub = this.userService.deleteProfile().subscribe(
      () => this.router.navigate(['/register']),
      (err) => (this.errMessage = err.error.message)
    );
  }
}
