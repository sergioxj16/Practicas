import { Component, DestroyRef, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';
import { GoogleLogin, UserLogin } from '../../shared/interfaces/user';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GeolocationService } from '../services/geolocation.service';
import { GoogleLoginDirective } from '../google-login/google-login.directive';


@Component({
	selector: 'login',
	imports: [ReactiveFormsModule, ValidationClassesDirective, RouterLink, GoogleLoginDirective],
	templateUrl: './login.component.html',
	styleUrl: './login.component.css'
})
export class LoginComponent {
	#router = inject(Router);
	#authService = inject(AuthService);
	#destroyRef = inject(DestroyRef);
	#formBuilder = inject(NonNullableFormBuilder);

	errorMessage = signal<number | null>(null);;

	loggedGoogle(resp: google.accounts.id.CredentialResponse) {
		// Envia esto tu API
		console.log(resp.credential);
	}

	loginForm = this.#formBuilder.group({
		email: ['', [Validators.required, Validators.email]],
		password: ['', [Validators.required]],
	});

	login(): void {
		const user: UserLogin = {
			email: this.loginForm.get('email')!.value,
			password: this.loginForm.get('password')!.value,
			lat: 0,
			lng: 0,
		};

		GeolocationService.getLocation()
			.then((coords) => {
				user.lat = coords.latitude;
				user.lng = coords.longitude;
			})
			.catch((err) => {
				console.log(err);
			});

		this.#authService.login(user).pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
			next: () => {
				this.errorMessage.set(null);
				this.#router.navigate(['/events']);
			},
			error: (err) => {
				this.errorMessage.set(err.status);
			}
		});
	}
	googleLogin(resp: google.accounts.id.CredentialResponse): void {
		const userData: GoogleLogin = {
			token: resp.credential,
			lat: 0,
			lng: 0,
		};

		this.#authService
			.googleLogin(userData)
			.pipe(takeUntilDestroyed(this.#destroyRef))
			.subscribe(() => {
				this.#router.navigate(['/events']);
			});
	}
}
