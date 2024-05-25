import { Component, OnInit } from '@angular/core';
import { AppelOffre } from '../model/appeloffre.model';
import { AppeloffreService } from '../services/appeloffre.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { Entreprise } from '../model/entreprise.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-appeloffresadmin',
  templateUrl: './appeloffresadmin.component.html',
  styleUrls: ['./appeloffresadmin.component.css']
})
export class AppeloffresadminComponent implements OnInit {
  appeloffres: AppelOffre[] = [];
  isLoading = true; // Track loading state
  entrepriseId: string | null = null;
  entreprise: Entreprise | null = null;

  constructor(private userService: UserService, private appeloffreService: AppeloffreService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.entrepriseId = params['id']; // Directly set entrepriseId from route parameters
      if (this.entrepriseId) {
        this.getAppelOffresByEntreprise(this.entrepriseId);
        this.loadEntreprise(this.entrepriseId);
      }
    });
  }

  private loadEntreprise(id: string): void {
    this.userService.getEntrepriseById(id).subscribe({
      next: (entreprise) => {
        this.entreprise = entreprise;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load entreprise:', error);
        this.isLoading = false;
      }
    });
  }

  supprimerAppelOffre(id: string): void {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Voulez-vous vraiment supprimer cet appel d\'offre?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#28a745', // Green color
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.appeloffreService.deleteAppelOffreAdmin(id).subscribe(() => {
          console.log('Appel doffre supprimé');
          Swal.fire(
            'Supprimé!',
            'L\'appel d\'offre a été supprimé.',
            'success'
          );
          this.getAppelOffresByEntreprise(this.entrepriseId!); // Reload the offers after successful deletion
        }, (error) => {
          console.warn('Error deleting appel d\'offre:', error); // Log as warning instead of error
          Swal.fire(
            'Erreur!',
            'Une erreur s\'est produite lors de la suppression de l\'appel d\'offre.',
            'error'
          );
        });
      }
    });
  }

  private getAppelOffresByEntreprise(entrepriseId: string): void {
    this.appeloffreService.getAppelOffresByEntrepriseId(entrepriseId).subscribe({
      next: (appeloffres) => {
        this.appeloffres = appeloffres;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load offers:', error);
        this.isLoading = false;
      }
    });
  }
}
