import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { User, UserLogin } from '../../shared/interfaces/user';
import { TokenResponse, UsersResponse } from '../../shared/interfaces/responses';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private http = inject(HttpClient);
	#logged: WritableSignal<boolean> = signal(false);


	login(user: UserLogin) {
		const loginUrl = 'auth/login';
		return this.http.post<TokenResponse>(loginUrl, user).pipe(map((res: TokenResponse) => {
			localStorage.setItem('token', res.accessToken);
			this.#logged.set(true);
		}));
	}

	get logged() {
		return this.#logged.asReadonly();
	}

	register(user: User): Observable<void> {
		const registerUrl = 'auth/register';

		return this.http.post<UsersResponse>(registerUrl, user).pipe(map(() => {
			console.log('User registered');
		}));
	}

	validateToken(): Observable<boolean> {
		const token = localStorage.getItem('token');
		const headers = { Authorization: `Bearer ${token}` };

		return this.http.get("auth/validate", { headers }).pipe(map(() => {
			this.#logged.set(true);
			return true;
		}),
			catchError(() => {
				localStorage.removeItem('token');
				this.#logged.set(false);
				return of(false);
			})
		);
	}

	isLogged(): Observable<boolean> {
		const token = localStorage.getItem('token');

		if (!this.#logged() && !token) {
			return of(false);
		}

		if (this.#logged()) {
			return of(true);
		}

		return this.validateToken();
	}

	logout() {
		localStorage.removeItem('token');
		this.#logged.set(false);
	}
}
