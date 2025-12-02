import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Sidebar} from '../../features/sidebar/sidebar';
import {RightSidebar} from '../../features/right-sidebar/right-sidebar';

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    Sidebar,
    RightSidebar
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
  standalone:true,
})
export class MainLayout {

}
