import { Component, OnInit } from '@angular/core';
import { AppelOffre } from '../model/appeloffre.model';
import { AppeloffreService } from '../services/appeloffre.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { Entreprise } from '../model/entreprise.model';

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
  constructor( private userService: UserService,private appeloffreService: AppeloffreService, private route: ActivatedRoute) {}

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
    let conf = confirm("Etes-vous sur ?");
    if (conf) {
      this.appeloffreService.deleteAppelOffreAdmin(id).subscribe(() => {
        console.log('Appel doffre supprimé');
        window.location.reload(); // Reload the page after successful deletion
      }, (error) => {
        console.warn(error); // Log as warning instead of error
        window.location.reload(); // Reload the page even if an error occurs
      });
    }
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

