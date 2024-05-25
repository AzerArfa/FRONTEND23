import { Component } from '@angular/core';
import { AppelOffre } from '../model/appeloffre.model';
import { AppeloffreService } from '../services/appeloffre.service';
import { ActivatedRoute } from '@angular/router';
import { Entreprise } from '../model/entreprise.model';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-detailsappeloffre',
  templateUrl: './detailsappeloffre.component.html',
  styleUrls: ['./detailsappeloffre.component.css']
})
export class DetailsappeloffreComponent {
  currentAppelOffre: AppelOffre = new AppelOffre();
  currentEntreprise: Entreprise = new Entreprise();
  offerId!: string;

  constructor(private activatedRoute: ActivatedRoute, 
              private appelofferService: AppeloffreService,
              private userService: UserService,
              private authService: AuthService,
            private location:Location ) {}

  ngOnInit(): void {
    this.offerId = this.activatedRoute.snapshot.params['id'];
    this.loadCurrentAppelOffre(this.offerId);
  }

  loadCurrentAppelOffre(offerId: string): void {
    this.appelofferService.getAppelOffreByIdUser(offerId).subscribe(appeloffre => {
      this.currentAppelOffre = appeloffre;
      if (appeloffre.entrepriseId) {
        this.loadCurrentEntreprise(appeloffre.entrepriseId);
      }
      console.log('Appel Offre data:', appeloffre);
    }, error => {
      console.error('Error loading offer data:', error);
    });
  }

  loadCurrentEntreprise(entrepriseId: string): void {
    this.userService.getEntrepriseById(entrepriseId).subscribe(entreprise => {
      this.currentEntreprise = entreprise;
    }, error => {
      console.error('Error loading entreprise data:', error);
    });
  }
  downloadDocument(appeloffreid: string): void {
    if (this.authService.isAdmin()) {
      this.appelofferService.downloadDocumentAppelOffreAdmin(appeloffreid).subscribe(blob => {
        this.handleDocumentDownload(blob);
      }, error => {
        console.error('Admin Download failed:', error);
      });
    } else {
      this.appelofferService.downloadDocumentAppelOffre(appeloffreid).subscribe(blob => {
        this.handleDocumentDownload(blob);
      }, error => {
        console.error('Download failed:', error);
      });
    }
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
}