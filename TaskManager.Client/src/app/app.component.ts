import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AccountService } from './_services/account.service';
import { AppUser } from './models/AppUser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  private router = inject(Router)  
  accountService = inject(AccountService);
  title = 'TaskManager.Client';
  toggle = true;

  ngOnInit(): void {
    this.setCurrentUser();
  }

  toggleSidebar() {
    this.toggle = !this.toggle;
  }
  setCurrentUser(){
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user: AppUser = JSON.parse(userString);
    this.accountService.setCurrentUser(user);
  }
  logout(){
    this.accountService.logout();
    this.router.navigateByUrl('');
  }
}
