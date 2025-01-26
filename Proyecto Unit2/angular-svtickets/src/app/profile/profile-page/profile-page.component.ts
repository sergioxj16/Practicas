import { Component, DestroyRef, effect, inject, input } from '@angular/core';
import { OlMapDirective } from '../../shared/directives/ol-maps/ol-map.directive';
import { OlMarkerDirective } from '../../shared/directives/ol-maps/ol-marker.directive';
import { User, UserProfileEdit } from '../../shared/interfaces/user';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService } from '../services/profile.service';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64.directive';
import { RouterLink, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'profile-page',
    imports: [OlMapDirective, OlMarkerDirective, ReactiveFormsModule, RouterLink, RouterModule, EncodeBase64Directive],
    templateUrl: './profile-page.component.html',
    styleUrl: './profile-page.component.css',
})
export class ProfilePageComponent {
    user = input.required<User>();

    isProfileFormVisible = false;
    isPasswordFormVisible = false;

    avatarBase64 = '';

    #profileService = inject(ProfileService);
    #destroyRef = inject(DestroyRef);
    #formBuilder = inject(NonNullableFormBuilder);

    constructor() {
        effect(() => this.initUserProfile());
    }

    initUserProfile() {
        const { name, email, avatar, } = this.user();
        this.profileForm.patchValue({ name, email });
        this.avatarBase64 = avatar;
    }

    profileForm = this.#formBuilder.group({
        name: ['', Validators.required],
        email: ['', Validators.required],
    });

    passwordForm = this.#formBuilder.group({
        password: ['', Validators.required],
        password2: ['', Validators.required],
    });

    refreshProfileData() {
        const { name, email } = this.user();
        this.profileForm.patchValue({ name, email });
    }

    populateProfileForm(userData: UserProfileEdit) {
        this.profileForm.patchValue({ name: userData.name, email: userData.email });
    }

    showProfileForm() {
        this.isProfileFormVisible = true;
        this.isPasswordFormVisible = false;
        this.populateProfileForm({
            name: this.user().name,
            email: this.user().email,
        });
    }

    showPasswordForm() {
        this.isProfileFormVisible = false;
        this.isPasswordFormVisible = true;
    }

    hideForms() {
        this.isProfileFormVisible = false;
        this.isPasswordFormVisible = false;
    }

    hideFormButtons() {
        this.isProfileFormVisible = false;
        this.isPasswordFormVisible = false;
    }

    handleAvatarUpdate(newAvatarBase64: string) {
        this.updateAvatarBase64(newAvatarBase64);
        this.updateAvatar();
    }

    updateAvatarBase64(newAvatarBase64: string) {
        this.avatarBase64 = newAvatarBase64;
    }

    updateAvatar() {
        const avatarPayload = this.createAvatarPayload();

        this.#profileService
            .updateProfileAvatar(avatarPayload)
            .subscribe(() => this.refreshProfileData());
    }

    createAvatarPayload() {
        return { avatar: this.avatarBase64 };
    }

    updateProfileInfo() {
        const updatedInfo = this.profileForm.getRawValue();

        this.#profileService.updateProfile(updatedInfo)
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(() => { this.refreshProfileData(); });
        this.hideForms();
    }

    updatePassword() {
        const newPasswordData = this.passwordForm.getRawValue();

        this.#profileService.updateUserPassword(newPasswordData)
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(() => this.refreshProfileData());

        this.hideForms();
    }
}
