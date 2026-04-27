import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { StepperModule } from 'primeng/stepper';
import { TextareaModule } from 'primeng/textarea';
import { Vendor } from '../../core/models';
import { AuthMockService } from '../../core/services/auth-mock.service';
import { MarketMockService } from '../../core/services/market-mock.service';
import { StallMockService } from '../../core/services/stall-mock.service';
import { VendorMockService } from '../../core/services/vendor-mock.service';
import { administrativePosts, businessCategories, infrastructureNeeds, municipalities, marketSectionNames } from '../../mock-data/reference-data';

@Component({
  selector: 'app-vendor-form',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    CardModule,
    CheckboxModule,
    DatePickerModule,
    FieldsetModule,
    FileUploadModule,
    InputNumberModule,
    InputTextModule,
    MultiSelectModule,
    SelectModule,
    StepperModule,
    TextareaModule
  ],
  template: `
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="page-title">{{ isEdit ? 'Edit Vendor Registration' : 'New Vendor Registration' }}</h1>
        <p class="text-sm text-slate-500">Digital Phase 1 registration form with vendor, business, declaration, and verification sections.</p>
      </div>
      <div class="flex gap-2">
        <button pButton type="button" label="Cancel" icon="pi pi-times" severity="secondary" outlined (click)="cancel()"></button>
        <button pButton type="button" label="Save Draft" icon="pi pi-save" severity="secondary" (click)="saveDraft()"></button>
        <button pButton type="button" label="Submit for Review" icon="pi pi-send" (click)="submitForReview()"></button>
      </div>
    </div>

    <p-card>
      <p-stepper [value]="1" [linear]="false">
        <p-step-list>
          <p-step [value]="1">Vendor Information</p-step>
          <p-step [value]="2">Business Information</p-step>
          <p-step [value]="3">Declaration</p-step>
          <p-step [value]="4">Administrative Verification</p-step>
        </p-step-list>
        <p-step-panels>
          <p-step-panel [value]="1">
            <ng-template #content let-activateCallback="activateCallback">
              <p-fieldset legend="A. Vendor Information">
                <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <div>
                    <label class="field-label required">Vendor full name</label>
                    <input pInputText [(ngModel)]="vendor.fullName" class="w-full" />
                    @if (submitted && !vendor.fullName) { <small class="text-red-600">Vendor full name is required.</small> }
                  </div>
                  <div>
                    <label class="field-label required">Identity document type</label>
                    <p-select [options]="documentTypes" [(ngModel)]="vendor.documentType" class="w-full"></p-select>
                  </div>
                  <div>
                    <label class="field-label required">Identity document number</label>
                    <input pInputText [(ngModel)]="vendor.documentNumber" class="w-full" />
                    @if (submitted && !vendor.documentNumber) { <small class="text-red-600">Document number is required.</small> }
                  </div>
                  <div>
                    <label class="field-label required">Gender</label>
                    <p-select [options]="genderOptions" [(ngModel)]="vendor.gender" class="w-full"></p-select>
                  </div>
                  <div>
                    <label class="field-label required">Age</label>
                    <p-inputNumber [(ngModel)]="vendor.age" [min]="16" [max]="100" styleClass="w-full"></p-inputNumber>
                  </div>
                  <div>
                    <label class="field-label required">Date of birth</label>
                    <p-datepicker [(ngModel)]="dob" dateFormat="yy-mm-dd" class="w-full" inputStyleClass="w-full"></p-datepicker>
                  </div>
                  <div>
                    <label class="field-label required">Phone number</label>
                    <input pInputText [(ngModel)]="vendor.phone" class="w-full" />
                  </div>
                  <div>
                    <label class="field-label required">Municipality</label>
                    <p-select [options]="municipalityOptions" [(ngModel)]="vendor.municipality" class="w-full" (ngModelChange)="onMunicipalityChange()"></p-select>
                  </div>
                  <div>
                    <label class="field-label">Administrative Post</label>
                    <p-select [options]="postOptions" [(ngModel)]="vendor.administrativePost" class="w-full"></p-select>
                  </div>
                  <div>
                    <label class="field-label">Suco</label>
                    <input pInputText [(ngModel)]="vendor.suco" class="w-full" />
                  </div>
                  <div>
                    <label class="field-label">Aldeia</label>
                    <input pInputText [(ngModel)]="vendor.aldeia" class="w-full" />
                  </div>
                  <div class="xl:col-span-2">
                    <label class="field-label">Full address</label>
                    <textarea pTextarea [(ngModel)]="vendor.address" rows="3" class="w-full"></textarea>
                  </div>
                  <div>
                    <label class="field-label">Vendor photo upload mock field</label>
                    <p-fileUpload mode="basic" chooseLabel="Choose Photo" accept="image/*" [auto]="true" (onSelect)="mockUpload('Photo', $any($event))"></p-fileUpload>
                  </div>
                  <div>
                    <label class="field-label">ID document upload mock field</label>
                    <p-fileUpload mode="basic" chooseLabel="Choose Document" [auto]="true" (onSelect)="mockUpload('Identity Document', $any($event))"></p-fileUpload>
                  </div>
                </div>
              </p-fieldset>
              <div class="mt-6 flex justify-end">
                <button pButton type="button" label="Next" icon="pi pi-arrow-right" iconPos="right" (click)="activateCallback(2)"></button>
              </div>
            </ng-template>
          </p-step-panel>

          <p-step-panel [value]="2">
            <ng-template #content let-activateCallback="activateCallback">
              <p-fieldset legend="B. Business Information">
                <div class="grid gap-4 md:grid-cols-2">
                  <div>
                    <label class="field-label required">Business category</label>
                    <p-select [options]="businessOptions" [(ngModel)]="vendor.business.category" class="w-full"></p-select>
                  </div>
                  <div>
                    <label class="field-label required">Type of goods sold</label>
                    <input pInputText [(ngModel)]="vendor.business.goodsSold" class="w-full" />
                  </div>
                  <div>
                    <label class="field-label">Other business type</label>
                    <input pInputText [(ngModel)]="vendor.business.otherBusinessType" class="w-full" />
                  </div>
                  <div>
                    <label class="field-label">Previous participation in this market</label>
                    <p-select [options]="yesNoOptions" [(ngModel)]="vendor.business.previousParticipation" optionLabel="label" optionValue="value" class="w-full"></p-select>
                  </div>
                  <div>
                    <label class="field-label">Year/date started in the market</label>
                    <p-datepicker [(ngModel)]="startedDate" dateFormat="yy-mm-dd" class="w-full" inputStyleClass="w-full"></p-datepicker>
                  </div>
                  <div>
                    <label class="field-label">Previous selling location</label>
                    <input pInputText [(ngModel)]="vendor.business.previousSellingLocation" class="w-full" />
                  </div>
                  <div>
                    <label class="field-label">Estimated daily sales</label>
                    <p-select [options]="salesOptions" [(ngModel)]="vendor.business.estimatedDailySales" class="w-full"></p-select>
                  </div>
                  <div>
                    <label class="field-label">Infrastructure needs</label>
                    <p-multiselect [options]="needOptions" [(ngModel)]="vendor.business.infrastructureNeeds" display="chip" class="w-full"></p-multiselect>
                  </div>
                  <div class="md:col-span-2">
                    <label class="field-label">Additional remarks</label>
                    <textarea pTextarea [(ngModel)]="vendor.business.remarks" rows="3" class="w-full"></textarea>
                  </div>
                </div>
              </p-fieldset>
              <div class="mt-6 flex justify-between">
                <button pButton type="button" label="Back" icon="pi pi-arrow-left" severity="secondary" (click)="activateCallback(1)"></button>
                <button pButton type="button" label="Next" icon="pi pi-arrow-right" iconPos="right" (click)="activateCallback(3)"></button>
              </div>
            </ng-template>
          </p-step-panel>

          <p-step-panel [value]="3">
            <ng-template #content let-activateCallback="activateCallback">
              <p-fieldset legend="C. Declaration">
                <div class="grid gap-4">
                  <label class="flex items-center gap-3"><p-checkbox [(ngModel)]="vendor.declaration.informationTrue" [binary]="true"></p-checkbox><span>I confirm the information is true</span></label>
                  <label class="flex items-center gap-3"><p-checkbox [(ngModel)]="vendor.declaration.followRules" [binary]="true"></p-checkbox><span>I agree to follow market rules</span></label>
                  <label class="flex items-center gap-3"><p-checkbox [(ngModel)]="vendor.declaration.noTransfer" [binary]="true"></p-checkbox><span>I agree not to rent, sell, or transfer the assigned space to another person</span></label>
                  @if (submitted && !declarationValid()) { <small class="text-red-600">All declaration confirmations are required before submission.</small> }
                  <div class="grid gap-4 md:grid-cols-2">
                    <div>
                      <label class="field-label">Vendor signature mock field</label>
                      <p-fileUpload mode="basic" chooseLabel="Choose Signature" accept="image/*" [auto]="true" (onSelect)="mockUpload('Signature', $any($event))"></p-fileUpload>
                    </div>
                    <div>
                      <label class="field-label">Registration date</label>
                      <p-datepicker [(ngModel)]="registrationDate" dateFormat="yy-mm-dd" class="w-full" inputStyleClass="w-full"></p-datepicker>
                    </div>
                  </div>
                </div>
              </p-fieldset>
              <div class="mt-6 flex justify-between">
                <button pButton type="button" label="Back" icon="pi pi-arrow-left" severity="secondary" (click)="activateCallback(2)"></button>
                <button pButton type="button" label="Next" icon="pi pi-arrow-right" iconPos="right" (click)="activateCallback(4)"></button>
              </div>
            </ng-template>
          </p-step-panel>

          <p-step-panel [value]="4">
            <ng-template #content let-activateCallback="activateCallback">
              <p-fieldset legend="D. Administrative Verification">
                <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <div>
                    <label class="field-label">Reviewing officer name</label>
                    <input pInputText [(ngModel)]="vendor.verification.reviewingOfficerName" class="w-full" />
                  </div>
                  <div>
                    <label class="field-label">Officer position</label>
                    <input pInputText [(ngModel)]="vendor.verification.officerPosition" class="w-full" />
                  </div>
                  <div>
                    <label class="field-label">Verification status</label>
                    <p-select [options]="verificationStatuses" [(ngModel)]="vendor.verification.verificationStatus" class="w-full"></p-select>
                  </div>
                  <div>
                    <label class="field-label">Approval status</label>
                    <p-select [options]="approvalStatuses" [(ngModel)]="vendor.verification.approvalStatus" class="w-full"></p-select>
                  </div>
                  <div>
                    <label class="field-label">Assigned municipality</label>
                    <p-select [options]="municipalityOptions" [(ngModel)]="vendor.verification.assignedMunicipality" class="w-full"></p-select>
                  </div>
                  <div>
                    <label class="field-label">Assigned market</label>
                    <p-select [options]="marketOptions" optionLabel="name" optionValue="id" [(ngModel)]="vendor.verification.assignedMarketId" class="w-full"></p-select>
                  </div>
                  <div>
                    <label class="field-label">Assigned market section</label>
                    <p-select [options]="sectionOptions" [(ngModel)]="vendor.verification.assignedMarketSection" class="w-full"></p-select>
                  </div>
                  <div>
                    <label class="field-label">Assigned stall/selling space</label>
                    <p-select [options]="availableStalls()" optionLabel="number" optionValue="id" [(ngModel)]="vendor.verification.assignedStallId" class="w-full"></p-select>
                  </div>
                  <div>
                    <label class="field-label">Approval date</label>
                    <p-datepicker [(ngModel)]="approvalDate" dateFormat="yy-mm-dd" class="w-full" inputStyleClass="w-full"></p-datepicker>
                  </div>
                  <div class="xl:col-span-3">
                    <label class="field-label">Comments</label>
                    <textarea pTextarea [(ngModel)]="vendor.verification.comments" rows="3" class="w-full"></textarea>
                  </div>
                </div>
              </p-fieldset>
              <div class="mt-6 flex flex-wrap justify-between gap-3">
                <button pButton type="button" label="Back" icon="pi pi-arrow-left" severity="secondary" (click)="activateCallback(3)"></button>
                <div class="flex gap-2">
                  <button pButton type="button" label="Save Draft" icon="pi pi-save" severity="secondary" (click)="saveDraft()"></button>
                  <button pButton type="button" label="Submit for Review" icon="pi pi-send" (click)="submitForReview()"></button>
                </div>
              </div>
            </ng-template>
          </p-step-panel>
        </p-step-panels>
      </p-stepper>
    </p-card>
  `
})
export class VendorFormComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly vendors = inject(VendorMockService);
  private readonly markets = inject(MarketMockService);
  private readonly stalls = inject(StallMockService);
  private readonly messages = inject(MessageService);
  private readonly auth = inject(AuthMockService);

  vendor = this.createEmptyVendor();
  isEdit = false;
  submitted = false;
  dob = new Date('1990-01-01');
  startedDate = new Date();
  registrationDate = new Date();
  approvalDate: Date | undefined;
  postOptions: string[] = administrativePosts['Dili'];

  readonly documentTypes = ['National ID', 'Electoral Card', 'Passport', 'Other'];
  readonly genderOptions = ['Female', 'Male', 'Other'];
  readonly municipalityOptions = municipalities;
  readonly businessOptions = businessCategories;
  readonly needOptions = infrastructureNeeds;
  readonly sectionOptions = marketSectionNames;
  get marketOptions() {
    return this.markets.markets();
  }
  readonly yesNoOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false }
  ];
  readonly salesOptions = ['Less than $100', '$100-$300', 'More than $300'];
  readonly verificationStatuses = ['Not Started', 'In Review', 'Verified', 'Failed'];
  readonly approvalStatuses = ['Draft', 'Submitted', 'Pending Verification', 'Approved', 'Rejected', 'Needs Correction', 'Inactive'];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const existing = this.vendors.getById(id);
      if (existing) {
        this.vendor = structuredClone(existing);
        this.isEdit = true;
        this.dob = new Date(existing.dateOfBirth);
        this.startedDate = new Date(existing.business.startedInMarket);
        this.registrationDate = new Date(existing.declaration.registrationDate);
        this.approvalDate = existing.verification.approvalDate ? new Date(existing.verification.approvalDate) : undefined;
        this.onMunicipalityChange();
      }
    }
  }

  availableStalls() {
    const marketId = this.vendor.verification.assignedMarketId;
    return marketId ? this.stalls.byMarket(marketId).filter((stall) => stall.status === 'Available' || stall.id === this.vendor.verification.assignedStallId) : [];
  }

  onMunicipalityChange(): void {
    this.postOptions = administrativePosts[this.vendor.municipality] ?? [];
    this.vendor.administrativePost = this.vendor.administrativePost || this.postOptions[0] || '';
  }

  declarationValid(): boolean {
    return this.vendor.declaration.informationTrue && this.vendor.declaration.followRules && this.vendor.declaration.noTransfer;
  }

  saveDraft(): Vendor | null {
    this.submitted = true;
    if (!this.basicValid()) {
      this.messages.add({ severity: 'warn', summary: 'Check required fields', detail: 'Vendor name, document number, phone, and business category are required.' });
      return null;
    }
    this.syncDates();
    const saved = this.vendors.saveDraft(this.vendor);
    this.vendor = structuredClone(saved);
    this.messages.add({ severity: 'success', summary: 'Draft saved', detail: `${saved.fullName} was saved in frontend memory.` });
    return saved;
  }

  submitForReview(): void {
    this.submitted = true;
    if (!this.basicValid() || !this.declarationValid()) {
      this.messages.add({ severity: 'warn', summary: 'Submission incomplete', detail: 'Please complete required fields and declaration confirmations.' });
      return;
    }
    const saved = this.saveDraft();
    if (!saved) {
      return;
    }
    this.vendors.submit(saved.id, this.auth.currentUser()?.fullName);
    this.messages.add({ severity: 'success', summary: 'Submitted for review', detail: 'Vendor now appears in the Approval Queue.' });
    void this.router.navigateByUrl('/approval-queue');
  }

  cancel(): void {
    void this.router.navigateByUrl('/vendors');
  }

  mockUpload(type: 'Photo' | 'Identity Document' | 'Signature', event: { files?: File[] }): void {
    const file = event.files?.[0];
    if (!file) {
      return;
    }
    this.vendor.documents = [
      { id: `${this.vendor.id || 'new'}-${type}-${Date.now()}`, type, fileName: file.name, uploadedAt: new Date().toISOString().slice(0, 10) },
      ...this.vendor.documents
    ];
    if (type === 'Signature') {
      this.vendor.declaration.signatureFileName = file.name;
    }
    this.messages.add({ severity: 'info', summary: 'Mock upload complete', detail: `${file.name} attached locally.` });
  }

  private basicValid(): boolean {
    return Boolean(this.vendor.fullName && this.vendor.documentNumber && this.vendor.phone && this.vendor.business.category);
  }

  private syncDates(): void {
    this.vendor.dateOfBirth = this.toIso(this.dob);
    this.vendor.business.startedInMarket = this.toIso(this.startedDate);
    this.vendor.declaration.registrationDate = this.toIso(this.registrationDate);
    this.vendor.verification.approvalDate = this.approvalDate ? this.toIso(this.approvalDate) : undefined;
  }

  private toIso(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  private createEmptyVendor(): Vendor {
    return {
      id: '',
      fullName: '',
      documentType: 'National ID',
      documentNumber: '',
      gender: 'Female',
      age: 30,
      dateOfBirth: '1990-01-01',
      phone: '',
      municipality: 'Dili',
      administrativePost: 'Cristo Rei',
      suco: '',
      aldeia: '',
      address: '',
      status: 'Draft',
      active: true,
      business: {
        category: 'Vegetables and Fruits',
        goodsSold: '',
        previousParticipation: false,
        startedInMarket: new Date().toISOString().slice(0, 10),
        previousSellingLocation: '',
        estimatedDailySales: 'Less than $100',
        infrastructureNeeds: [],
        remarks: ''
      },
      documents: [],
      declaration: {
        informationTrue: false,
        followRules: false,
        noTransfer: false,
        registrationDate: new Date().toISOString().slice(0, 10)
      },
      verification: {
        reviewingOfficerName: this.auth.currentUser()?.fullName ?? '',
        officerPosition: 'Registration Officer',
        verificationStatus: 'Not Started',
        approvalStatus: 'Draft',
        assignedMunicipality: 'Dili',
        comments: ''
      },
      statusHistory: [{ date: new Date().toLocaleString(), status: 'Draft', actor: 'Registration Officer', notes: 'Draft opened.' }],
      createdAt: '',
      updatedAt: ''
    };
  }
}
