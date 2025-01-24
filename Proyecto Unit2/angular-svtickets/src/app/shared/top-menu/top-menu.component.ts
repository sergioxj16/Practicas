import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'top-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './top-menu.component.html',
  styleUrl: './top-menu.component.css'
})
export class TopMenuComponent {
  title = 'SVTickets';

  private authService = inject(AuthService);
  private router = inject(Router);

  isLogged = computed(() => this.authService.logged);

  logout() {
    this.authService.logout();
    this.router.navigate(['auth/login']);
  }
}
