import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { RoleName } from '../../core/models';
import { AuthMockService } from '../../core/services/auth-mock.service';
import { roles } from '../../mock-data/reference-data';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ButtonModule, CardModule, InputTextModule, PasswordModule, SelectModule],
  template: `
    <main class="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <section class="grid w-full max-w-5xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm md:grid-cols-[1.1fr_0.9fr]">
        <div class="bg-ministry-700 p-8 text-white md:p-10">
          <div class="mb-10 flex items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-md bg-white font-bold text-ministry-700">TL</div>
            <div>
              <h1 class="text-2xl font-bold">SIM-Merkadu TL</h1>
              <p class="text-sm text-ministry-100">Sistema Informasaun Merkadu Timor-Leste</p>
            </div>
          </div>
          <h2 class="mb-4 text-3xl font-bold leading-tight">Phase 1 market vendor registration workspace</h2>
          <p class="max-w-xl text-ministry-50">
            Frontend-only MVP for government, municipal, and market officers to register vendors, review applications,
            assign selling spaces, and prepare printable vendor ID information.
          </p>
          <div class="mt-10 grid gap-3 text-sm">
            <div class="rounded-md bg-white/10 p-3">Mock role-based workflows, no real authentication server.</div>
            <div class="rounded-md bg-white/10 p-3">Timor-Leste municipalities, markets, vendors, and stalls loaded in memory.</div>
          </div>
        </div>
        <div class="p-6 md:p-10">
          <h2 class="mb-1 text-2xl font-bold text-slate-950">Mock Login</h2>
          <p class="mb-6 text-sm text-slate-500">Any username and password will open the MVP.</p>
          <form class="space-y-5" (ngSubmit)="login()">
            <div>
              <label class="field-label required" for="username">Username</label>
              <input pInputText id="username" name="username" [(ngModel)]="username" class="w-full" autocomplete="username" />
            </div>
            <div>
              <label class="field-label required" for="password">Password</label>
              <p-password
                id="password"
                name="password"
                [(ngModel)]="password"
                [feedback]="false"
                [toggleMask]="true"
                styleClass="w-full"
                inputStyleClass="w-full"
              ></p-password>
            </div>
            <div>
              <label class="field-label required" for="role">Role</label>
              <p-select id="role" name="role" [options]="roleOptions" [(ngModel)]="role" class="w-full"></p-select>
            </div>
            <button pButton type="submit" label="Enter Dashboard" icon="pi pi-arrow-right" class="w-full"></button>
          </form>
        </div>
      </section>
    </main>
  `
})
export class LoginComponent {
  username = 'officer';
  password = 'password';
  role: RoleName = 'Market Officer / Data Entry Officer';
  readonly roleOptions = roles.map((item) => item.name);

  constructor(private readonly auth: AuthMockService) {}

  login(): void {
    this.auth.login(this.username, this.role);
  }
}
