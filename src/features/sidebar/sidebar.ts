import {Component, computed, inject, signal} from '@angular/core';
import {AuthService} from '../../services/auth-service/auth-service';
import {AsyncPipe, NgClass} from '@angular/common';
import {User} from '../../components/ui/user/user';
import {ModalOption, SideModal} from '../../components/ui/side-modal/side-modal';
import {toSignal} from '@angular/core/rxjs-interop';
import {Router} from '@angular/router';
import {UserProfile} from '../../models/User';

@Component({
  selector: 'app-sidebar',
  imports: [AsyncPipe, User, SideModal, NgClass],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})

export class Sidebar {
  auth = inject(AuthService);
  currentUser: UserProfile | null = null
  isOpen = signal(false);
  path = signal('')

  ngOnInit() {
    this.currentUser = this.auth.getUser()
  }

  constructor(private router: Router) {
    this.path.set(this.router.url)
  }

  toggleModal() {
    this.isOpen.update(value => !value);
  }

  modalOptions = computed<ModalOption[]>(() => {
    const username:string = this.currentUser?.username || 'user'

    return [
      {
        label: `Logout ${username}`,
        icon: '/assets/icons/logout.svg',
        action: ($event) => {
          $event.stopPropagation();
          this.onLogout();
          this.isOpen.set(false);
        }
      }
    ]
  })

  onLogout() {
    this.auth.logout().subscribe();
  }

  menuOptions = computed(() => {
    const currPath = this.path();

    return [
      { name: 'Home', icon: 'assets/icons/house.svg', isActive: currPath === '/' },
      { name: 'Explore', icon: 'assets/icons/search.svg', isActive: currPath.startsWith('/explore') },
      { name: 'Notifications', icon: 'assets/icons/notifications.svg', isActive: currPath.startsWith('/notifications') },
      { name: 'Messages', icon: 'assets/icons/message.svg', isActive: currPath.startsWith('/messages')},
      { name: 'Lists', icon: 'assets/icons/lists.svg', isActive: currPath.startsWith('/lists')},
      { name: 'Bookmarks', icon: 'assets/icons/bookmark.svg', isActive: currPath.startsWith('/bookmarks')},
      { name: 'Communities', icon: 'assets/icons/users.svg', isActive: currPath.startsWith('/communities')},
      { name: 'Premium', icon: 'assets/icons/logo.svg', isActive: currPath.startsWith('/premium')},
      { name: 'Profile', icon: 'assets/icons/user.svg', isActive: currPath.startsWith('/profile')},
      { name: 'More', icon: 'assets/icons/more.svg', isActive:currPath.startsWith('/more')},
    ];
  })
}
