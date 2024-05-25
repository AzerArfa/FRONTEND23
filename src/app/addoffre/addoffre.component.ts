import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AppeloffreService } from '../services/appeloffre.service';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Entreprise } from '../model/entreprise.model';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-addoffre',
  templateUrl: './addoffre.component.html',
  styleUrls: ['./addoffre.component.css']
})
export class AddoffreComponent implements OnInit {
  nomAppelOffre: string = "";
  idAppelOffre!: string;
  newOffre: any = {
    numtel: '',
    montant: null,
    delaisderealisation: null,
    entrepriseid: '',
    documentdeproposition: null
  };
  selectedDocument: File | null = null;
  isAdmin: boolean = false;
  entreprises: Entreprise[] = [];
  userid!: Observable<string | null>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private authService: AuthService,
    private userService: UserService,
    private offreService: AppeloffreService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idAppelOffre = params['id'];
      this.getAppelOffreById(this.idAppelOffre);
      this.isAdmin = this.authService.isAdmin();
      this.loadEnterprises();
    });
  }

  loadEnterprises() {
    this.userService.getentreprisesbyuserid(this.authService.getUserInfo().userId).subscribe(
      data => {
        this.entreprises = data;
      },
      error => {
        console.error('Error fetching enterprises:', error);
      }
    );
  }

  getAppelOffreById(id: string): void {
    const fetchFunction = this.isAdmin ? this.offreService.getAppelOffreById(id) : this.offreService.getAppelOffreByIdUser(id);

    fetchFunction.subscribe({
      next: (appelOffre) => {
        this.nomAppelOffre = appelOffre.titre;
      },
      error: (error) => {
        console.error('Error fetching AppelOffre', error);
      }
    });
  }

  onDocumentSelected(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.selectedDocument = event.target.files[0];
    }
  }

  createOffre(): void {
    const formData = new FormData();
    formData.append('numtel', this.newOffre.numtel);
    formData.append('montant', this.newOffre.montant.toString());
    formData.append('delaisderealisation', this.newOffre.delaisderealisation);
    formData.append('entrepriseid', this.newOffre.entrepriseid);
    
    if (this.selectedDocument) {
      formData.append('documentdeproposition', this.selectedDocument, this.selectedDocument.name);
    }

    const createFunction = this.isAdmin ? this.offreService.createOffreAdmin(this.idAppelOffre, formData) : this.offreService.createOffre(this.idAppelOffre, formData);

    createFunction.subscribe({
      next: (response) => {
        console.log('Offer created successfully', response);
        this.router.navigate(['/home']);
        this.toastr.success('Création terminé avec succès', 'Offre', {
          timeOut: 5000,
          closeButton: true,
          progressBar: true,
          positionClass: 'toast-top-right',
        });
      },
      error: (error) => {
        this.toastr.error('Création échouée.', 'Offre', {
          timeOut: 5000,
          closeButton: true,
          progressBar: true,
          positionClass: 'toast-top-right',
        });
        console.error('Error creating offer', error);
        alert('Failed to create the offer. Check console for details.');
      }
    });
  }
}
