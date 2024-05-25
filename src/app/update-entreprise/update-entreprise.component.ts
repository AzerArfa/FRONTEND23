import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Entreprise } from '../model/entreprise.model';

@Component({
  selector: 'app-update-entreprise',
  templateUrl: './update-entreprise.component.html',
  styleUrls: ['./update-entreprise.component.css']
})
export class UpdateEntrepriseComponent implements OnInit {
  selectedDocument: File | null = null;
  codetvadocument: File | null = null;
  logoPreview: string | ArrayBuffer | null = null; // Image preview
  showFileInput: boolean = false; // Flag to control file input visibility

  currentEntreprise: Entreprise = {
    id: '',
    name: '',
    adresse: '',
    secteuractivite: '',
    matricule: '',
    ville: '',
    siegesociale: '',
    codeTVA: '',
    logo: null,
    users: [],
    codetvadocument: '',
    status: ''
  };

  userInfo: any;
  originalLogo: any = null; // Store the original logo
  originalCodetvadocument: any = null; // Store the original CODETVA document
  originalStatusDocument: any = null; // Store the original status document

  logoUploaded: boolean = false;
  codetvadocumentUploaded: boolean = false;
  statusDocumentUploaded: boolean = false;

  constructor(
    private toastr: ToastrService,
    private userService: UserService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      this.userService.getEntrepriseById(id).subscribe(
        data => {
          this.currentEntreprise = data;
          if (this.currentEntreprise.logo) {
            this.originalLogo = this.currentEntreprise.logo; // Store the original logo
            this.currentEntreprise.logoUrl = `data:image/jpeg;base64,${this.currentEntreprise.logo}`;
            this.logoPreview = this.currentEntreprise.logoUrl as string; // Cast to string
          }
          // Store the original documents
          if (this.currentEntreprise.codetvadocument) {
            this.originalCodetvadocument = this.currentEntreprise.codetvadocument;
          }
          if (this.currentEntreprise.status) {
            this.originalStatusDocument = this.currentEntreprise.status;
          }
        },
        error => console.error(error)
      );
    });

    // Retrieve the user info from AuthService
    this.userInfo = this.authService.getUserInfo();
  }

  openFileInput(): void {
    const fileInput = document.getElementById('logoInput') as HTMLInputElement;
    fileInput.click(); // Trigger the file input click event
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      // A new file has been selected
      this.currentEntreprise.logo = event.target.files[0];
      this.logoUploaded = !!this.currentEntreprise.logo;
      this.showFileInput = false; // Close file input after selecting a file
      // Read the selected file and display it dynamically
      if (this.currentEntreprise.logo) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.logoPreview = e.target?.result as string | ArrayBuffer | null;
        };
        reader.readAsDataURL(this.currentEntreprise.logo);
      }
    } else {
      // No new file was selected, keep the original logo
      this.showFileInput = false; // Close file input if no file selected
      this.logoPreview = this.currentEntreprise.logoUrl || null; // Reset image preview
    }
  }

  onDocumentCODETVASelected(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.codetvadocument = event.target.files[0];
      this.codetvadocumentUploaded = !!this.codetvadocument;
    }
  }

  onDocumentSelected(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.selectedDocument = event.target.files[0];
      this.statusDocumentUploaded = !!this.selectedDocument;
    }
  }

  updateEntreprise() {
    const formData = new FormData();
    formData.append('name', this.currentEntreprise.name);
    formData.append('adresse', this.currentEntreprise.adresse);
    formData.append('secteuractivite', this.currentEntreprise.secteuractivite);
    formData.append('Matricule', this.currentEntreprise.matricule);
    formData.append('ville', this.currentEntreprise.ville);
    formData.append('siegesociale', this.currentEntreprise.siegesociale);
    formData.append('codeTVA', this.currentEntreprise.codeTVA);

    // Append the logo only if a new one has been selected
    if (this.currentEntreprise.logo && this.currentEntreprise.logo !== this.originalLogo) {
      formData.append('logo', this.currentEntreprise.logo);
    } else {
      formData.append('logo', this.originalLogo); // Retain original logo if no new file selected
    }

    // Append the CODETVA document if a new one has been selected
    if (this.codetvadocument) {
      formData.append('codetvadocument', this.codetvadocument, this.codetvadocument.name);
    } else if (this.originalCodetvadocument) {
      formData.append('codetvadocument', this.originalCodetvadocument);
    }

    // Append the status document if a new one has been selected
    if (this.selectedDocument) {
      formData.append('status', this.selectedDocument, this.selectedDocument.name);
    } else if (this.originalStatusDocument) {
      formData.append('status', this.originalStatusDocument);
    }

    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      this.userService.updateEntreprise(id, formData).subscribe(
        () => {
          this.router.navigate(['/profile']);
          this.toastr.success('Modification terminé avec succès', "Entreprise", {
            timeOut: 5000,
            closeButton: true,
            progressBar: true,
            positionClass: 'toast-top-right',
          });
        },
        error => {
          this.toastr.error('Modification échouée', "Entreprise", {
            timeOut: 5000,
            closeButton: true,
            progressBar: true,
            positionClass: 'toast-top-right',
          });
          console.error(error);
        }
      );
    });
  }
}
