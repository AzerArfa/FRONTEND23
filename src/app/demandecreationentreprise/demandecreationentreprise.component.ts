import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-demandecreationentreprise',
  templateUrl: './demandecreationentreprise.component.html',
  styleUrls: ['./demandecreationentreprise.component.css']
})
export class DemandecreationentrepriseComponent  implements OnInit {
  newEntreprise: any = {
    name: '',
    adresse: '',
    secteuractivite: '',
    Matricule: '',
    ville: '',
    siegesociale: '',
    codeTVA: '',
    codetvadocument:'',
    status:''
  };
  selectedFile: File | null = null;
  userId!: string | null;
  selectedDocument: File | null = null;
  codetvadocument: File | null = null;

  logoUploaded: boolean = false;
  codetvadocumentUploaded: boolean = false;
  statusDocumentUploaded: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private authservice:AuthService,
    private toastr:ToastrService
  ) {}

  ngOnInit(): void {
    this.authservice.getUserId().subscribe(id => {
      this.userId = id;
      console.log('User ID:', this.userId); // For debugging purposes
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.logoUploaded = !!this.selectedFile;
  }

  onSubmit(): void {
    const formData: FormData = new FormData();
    formData.append('name', this.newEntreprise.name);
    formData.append('adresse', this.newEntreprise.adresse);
    formData.append('secteuractivite', this.newEntreprise.secteuractivite);
    formData.append('Matricule', this.newEntreprise.Matricule);
    formData.append('ville', this.newEntreprise.ville);
    formData.append('siegesociale', this.newEntreprise.siegesociale);
    formData.append('codeTVA', this.newEntreprise.codeTVA);

    if (this.selectedFile) {
      formData.append('logo', this.selectedFile, this.selectedFile.name);
    }
    if (this.codetvadocument) {
      console.log('Appending codetvadocument:', this.codetvadocument.name);
      formData.append('codetvadocument', this.codetvadocument, this.codetvadocument.name);
    }
    
    if (this.selectedDocument) {
      formData.append('status', this.selectedDocument, this.selectedDocument.name);
    }
    console.log('Form Data to be sent:', (formData as any).entries ? Object.fromEntries((formData as any).entries()) : formData); // Debugging

    this.userService.requestToAddEntreprise(this.userId!, formData).subscribe(
      response => {
        console.log('Request added successfully:', response);
        this.router.navigate([`/profile`]);
        this.toastr.success('Votre demande a été envoyé avec succées', 'Demande rejoint entreprise', {
          timeOut: 5000,
          closeButton: true,
          progressBar: true,
          positionClass: 'toast-top-right',
        });
      },
      error => {
        this.toastr.error('Votre demande n’a pas pu être traitée', 'Échec de la demande', {
          timeOut: 5000,
          closeButton: true,
          progressBar: true,
          positionClass: 'toast-top-right',
      });
        console.error('Error adding Request:', error);
        if (error.error) {
          console.error('Backend returned error message:', error.error);
        }
        if (error.status === 200) {
          console.error('Received status 200, but there was an error in the response.');
        }
      }
    );
  }
  
  onDocumentCODETVASelected(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.codetvadocument = event.target.files[0];
      this.codetvadocumentUploaded = !!this.codetvadocument;
      console.log('Selected CODETVA Document:', this.codetvadocument);
    }
  }
  
  onDocumentSelected(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.selectedDocument = event.target.files[0];
      this.statusDocumentUploaded = !!this.selectedDocument;
    }
  }
}
