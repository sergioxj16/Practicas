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

	login(user: UserLogin) {
		const loginUrl = 'auth/login';
		return this.http.post<TokenResponse>(loginUrl, user).pipe(map((res: TokenResponse) => {
			localStorage.setItem('token', res.accessToken);
			this.#logged.set(true);
		}));
	}

	register(user: User):Observable<void> {
		const registerUrl = 'auth/register';

		return this.http.post<UsersResponse>(registerUrl, user).pipe(map(() => {
			console.log('User registered');
		}));
	}

	#logged: WritableSignal<boolean> = signal(false);

	get logged() {
		return this.#logged.asReadonly();
	}

	isLogged(): Observable<boolean> {
		const token = localStorage.getItem('token');

		if (!this.#logged && !token) {
			return of(false);
		}

		if (this.#logged()) {
			return of(true);
		}

		const checkUrl = 'auth/validated';

		return this.http.get(checkUrl).pipe(map(() => {
			this.#logged.set(true);
			return true;
		}),
			catchError(() => {
				this.#logged.set(false);
				localStorage.removeItem('token');
				return of(false);
			}
			));
	}

	logout() {
		localStorage.removeItem('token');
		this.#logged.set(false);
	}
}
