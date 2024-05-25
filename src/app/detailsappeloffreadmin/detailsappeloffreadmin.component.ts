import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppelOffre } from '../model/appeloffre.model';
import { Entreprise } from '../model/entreprise.model';
import { Offre } from '../model/offre.model';
import { AppeloffreService } from '../services/appeloffre.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-detailsappeloffreadmin',
  templateUrl: './detailsappeloffreadmin.component.html',
  styleUrls: ['./detailsappeloffreadmin.component.css']
})
export class DetailsappeloffreadminComponent implements OnInit {
  currentAppelOffre: AppelOffre = new AppelOffre();
  currentEntreprise: Entreprise = new Entreprise();
  offres: Offre[] = [];
  entrepriseNames: Map<string, string> = new Map();

  constructor(private activatedRoute: ActivatedRoute, 
              private appelOffreService: AppeloffreService,
              private userService: UserService) {}

  ngOnInit(): void {
    const appelOffreId = this.activatedRoute.snapshot.params['id'];
    this.loadCurrentAppelOffre(appelOffreId);
    this.loadOffres(appelOffreId);
  }

  loadCurrentAppelOffre(appelOffreId: string): void {
    this.appelOffreService.getAppelOffreByIdUser(appelOffreId).subscribe(
      appeloffre => {
        this.currentAppelOffre = appeloffre;
        this.loadCurrentEntreprise(appeloffre.entrepriseId);
        console.log('Appel Offre data:', appeloffre);
      },
      error => console.error('Error loading appel offre data:', error)
    );
  }

  loadCurrentEntreprise(entrepriseId: string): void {
    this.userService.getEntrepriseById(entrepriseId).subscribe(
      entreprise => this.currentEntreprise = entreprise,
      error => console.error('Error loading entreprise data:', error)
    );
  }

  loadOffres(appelOffreId: string): void {
    this.appelOffreService.getOffresByappeloffresidadmin(appelOffreId).subscribe(
      offres => {
        this.offres = offres;
        this.loadEnterpriseNames();
      },
      error => console.error('Error loading offers:', error)
    );
  }

  loadEnterpriseNames(): void {
    const enterpriseIds = new Set(this.offres.map(offre => offre.entrepriseid));
    enterpriseIds.forEach(id => {
      this.userService.getEntrepriseById(id).subscribe(
        entreprise => this.entrepriseNames.set(id, entreprise.name),
        error => console.error(`Error loading enterprise data for ID ${id}:`, error)
      );
    });
  }

  getEnterpriseName(id: string): string {
    return this.entrepriseNames.get(id) || 'Loading...';
  }

  downloadDocument(offreId: string): void {
    this.appelOffreService.downloadDocument(offreId).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'OffreTelechargé.pdf';
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      link.remove();
    }, error => {
      console.error('Download failed:', error);
    });
  }
  private handleDocumentDownload(blob: Blob): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'AppelOffreTélechargé.pdf';  // You can set the default file name for download
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    link.remove();
  }
  downloadDocumentAppelOffre(appeloffreid: string): void {
   
      this.appelOffreService.downloadDocumentAppelOffreAdmin(appeloffreid).subscribe(blob => {
        this.handleDocumentDownload(blob);
      }, error => {
        console.error('Admin Download failed:', error);
      });
    
  }
}
