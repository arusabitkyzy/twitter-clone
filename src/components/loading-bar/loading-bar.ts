import {Component, input} from '@angular/core';

@Component({
  selector: 'app-loading-bar',
  imports: [],
  templateUrl: './loading-bar.html',
  styleUrl: './loading-bar.scss',
})
export class LoadingBar {
  isLoading = input<boolean>(false);
}
