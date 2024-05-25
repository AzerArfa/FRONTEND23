import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  userInfo: any;
  isloggedIn: boolean = false;
  isSuperAdmin: boolean = false;
  private userInfoSubscription?: Subscription;

  constructor(
    public authService: AuthService, 
    private router: Router, 
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.refreshNavbar();

    // Subscribe to changes in user info and login status
    this.authService.userInfo.subscribe(userInfo => {
      this.userInfo = userInfo;
      console.log('Navbar user info updated:', this.userInfo);
      this.cdr.detectChanges(); // Manually trigger change detection
    });

    this.authService.isloggedIn.subscribe(isLoggedIn => {
      this.isloggedIn = isLoggedIn;
      this.cdr.detectChanges(); // Manually trigger change detection
    });

    // Initialize with current state
    this.userInfo = this.authService.getUserInfo();
    this.isloggedIn = this.authService.isloggedInState;
    this.isSuperAdmin = this.authService.isSuperAdmin(); 
  }

  refreshNavbar(): void {
    this.userInfo = this.authService.getUserInfo();
    this.isloggedIn = this.authService.isloggedInState;
    this.isSuperAdmin = this.authService.isSuperAdmin(); 
    console.log('Navbar refreshed:', this.userInfo);
    this.cdr.detectChanges(); // Manually trigger change detection
  }

  onLogout() {
    this.authService.logout();  // Assuming logout method clears the local storage or session
    this.isloggedIn = false;
    this.isSuperAdmin = false;  // Reset superadmin role
    this.router.navigate(['/login']);  // Redirect to login page or home page after logout
  }
  

  ngOnDestroy(): void {
    if (this.userInfoSubscription) {
      this.userInfoSubscription.unsubscribe();
    }
  }
}