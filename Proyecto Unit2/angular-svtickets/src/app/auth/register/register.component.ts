import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';
import { User } from '../../shared/interfaces/user';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64.directive';
import { GeolocationService } from '../services/geolocation.service';
import { CanComponentDeactivate } from '../../shared/guards/leave-page.guard';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../../shared/modals/confirm-modal/confirm-modal.component';


@Component({
	selector: 'register',
	imports: [ReactiveFormsModule, ValidationClassesDirective, RouterLink, EncodeBase64Directive],
	templateUrl: './register.component.html',
	styleUrl: './register.component.css'
})
export class RegisterComponent implements CanComponentDeactivate {
	#router = inject(Router);
	#authService = inject(AuthService);
	#formBuilder = inject(NonNullableFormBuilder);
	#modalService = inject(NgbModal);

	errorMessage = signal<number | null>(null);;

	registerForm = this.#formBuilder.group({
		name: ['', [Validators.required]],
		email: ['', [Validators.required, Validators.email]],
		emailConfirm: ['', [Validators.required, Validators.email]],
		password: ['', [Validators.required, Validators.minLength(4)]],
		lat: [0],
		lng: [0],
		avatar: ['', [Validators.required]]
	});

	saved = false;
	base64image = '';

	checkImage(fileInput: HTMLInputElement) {
		if (!fileInput.files || fileInput.files.length === 0) {
			this.base64image = '';
		}
	}

	register(): void {
		const registerForm = {
			...this.registerForm.getRawValue(),
		};

		const user: User = {
			name: registerForm.name,
			email: registerForm.email,
			password: registerForm.password,
			lat: registerForm.lat,
			lng: registerForm.lng,
			avatar: this.base64image
		};

		this.#authService.register(user).subscribe({
			next: () => {
				this.#router.navigate(['/login']);
				this.saved = true;
				this.errorMessage.set(null);
			},
			error: (err) => {
				console.error('Registration error:', err);
				this.errorMessage.set(err.status);
			}
		});
	}

	constructor() {
		const latitude = this.registerForm.get('lat');
		const longitude = this.registerForm.get('lng');

		GeolocationService.getLocation()
			.then((coords) => {
				latitude?.setValue(coords.latitude);
				longitude?.setValue(coords.longitude);
			})
			.catch((err) => {
				console.log(err);
				latitude?.setValue(0);
				longitude?.setValue(0);
			});
	}

	canDeactivate() {
		if (this.saved || this.registerForm.pristine) return true;

		const modalRef = this.#modalService.open(ConfirmModalComponent);
		modalRef.componentInstance.title = 'Changes will not be saved';
		modalRef.componentInstance.body = 'Do you want to leave the page?. Changes will be lost...';
		return modalRef.result.catch(() => false);
	}
}
