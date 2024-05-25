import { Component, OnInit } from '@angular/core';
import { User } from '../model/user.model';
import { UserService } from '../services/user.service';
import { AppeloffreService } from '../services/appeloffre.service';
import { AuthService } from '../services/auth.service';
import { DemandeAjoutEntreprise } from '../model/demandeajoutentreprise.model';
import { DemandeRejoindreEntreprise } from '../model/demanderejoindreentreprise.model';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser = new User();
  isAdmin!: boolean;
  isSuperAdmin!: boolean;
  creationRequests: DemandeAjoutEntreprise[] = [];
  joinRequests: DemandeRejoindreEntreprise[] = [];
  userId!: string;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private appeloffreService: AppeloffreService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.authService.getUserId().subscribe({
      next: (userId) => {
        if (userId) {
          this.userId = userId;
          this.loadCurrentUser(userId);
          this.isAdmin = this.authService.isAdmin();
          this.isSuperAdmin = this.authService.isSuperAdmin();
          console.log(this.isSuperAdmin);

          if (this.isAdmin) {
            this.loadJoinRequests();
          } else if (this.isSuperAdmin) {
            this.loadCreationRequests();
          }
        } else {
          console.error('User ID not found');
        }
      },
      error: (err) => console.error('Failed to get user ID:', err)
    });
  }

  loadCreationRequests(): void {
    this.userService.getAllCreationRequests().subscribe({
      next: (requests) => {
        this.creationRequests = requests;
      },
      error: (err) => console.error('Failed to fetch creation requests:', err)
    });
  }

  approveCreation(requestId: string, userId: string) {
    this.userService.approveCreationRequest(requestId, userId).subscribe({
      next: (response) => {
        this.toastr.success('Demande de création approuvée avec succès', "Entreprise", {
          timeOut: 5000,
          closeButton: true,
          progressBar: true,
          positionClass: 'toast-top-right',
        });
        console.log('Demande de création approuvée avec succès:', response);
        this.loadCreationRequests();
      },
      error: (error) => {
        this.toastr.error("Échec de l'approbation de la demande de création", "Entreprise", {
          timeOut: 5000,
          closeButton: true,
          progressBar: true,
          positionClass: 'toast-top-right',
        });
        console.error("Échec de l'approbation de la demande de création", error);
        const errorMessage = error.error.error || error.message;
        console.log('Error message from the server:', errorMessage);
      }
    });
  }

  rejectCreation(requestId: string) {
    this.userService.rejectCreationRequest(requestId).subscribe({
      next: () => {
        console.log('Creation request rejected successfully.');
        this.toastr.success('Demande de création rejetée avec succès', "Entreprise", {
          timeOut: 5000,
          closeButton: true,
          progressBar: true,
          positionClass: 'toast-top-right',
        });
        this.loadCreationRequests();
      },
      error: (error) => {
        console.error('Failed to reject creation request:', error);
        this.toastr.error('Échec du rejet de la demande de création', "Entreprise", {
          timeOut: 5000,
          closeButton: true,
          progressBar: true,
          positionClass: 'toast-top-right',
        });
      }
    });
  }

  approveJoin(requestId: string) {
    this.userService.approveJoinRequest(requestId).subscribe({
      next: (response) => {
        console.log('Join request approved:', response);
        this.loadJoinRequests();
        this.toastr.success("Demande d'adhésion approuvée ", "Entreprise", {
          timeOut: 5000,
          closeButton: true,
          progressBar: true,
          positionClass: 'toast-top-right',
        });
      },
      error: (error) => {
        this.toastr.error("Échec de l'approbation de la demande d'adhésion", "Entreprise", {
          timeOut: 5000,
          closeButton: true,
          progressBar: true,
          positionClass: 'toast-top-right',
        });
        console.error('Failed to approve join request', error);
        console.log('Error response:', error.error.text);
      }
    });
  }

  rejectJoin(requestId: string) {
    this.userService.rejectJoinRequest(requestId).subscribe({
      next: (response) => {
        this.toastr.success("Demande d'adhésion rejetée avec succès", "Entreprise", {
          timeOut: 5000,
          closeButton: true,
          progressBar: true,
          positionClass: 'toast-top-right',
        });
        console.log('Join request rejected');
        this.loadJoinRequests();
      },
      error: (err) => {
        console.error('Failed to reject join request', err);
        this.toastr.error("Échec du rejet de la demande d'adhésion", "Entreprise", {
          timeOut: 5000,
          closeButton: true,
          progressBar: true,
          positionClass: 'toast-top-right',
        });
      }
    });
  }

  loadJoinRequests(): void {
    this.userService.getAllJoinRequests(this.userId).subscribe({
      next: (requests) => {
        this.joinRequests = requests;
        this.joinRequests.forEach(request => {
          this.userService.getUserById(request.userId).subscribe(user => {
            request.userName = user.name;
            request.userCIN = user.cin;
            request.userImg = user.img;
          });
        });
      },
      error: (err) => console.error('Failed to fetch join requests:', err)
    });
  }

  loadCurrentUser(userId: string): void {
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.currentUser = user;
        console.log('User data:', user);
      },
      error: (error) => {
        console.error('Error loading user data:', error);
      }
    });
  }

  formatDate(date: Date): string {
    if (!date) {
      return '';
    }

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      console.error('Invalid date:', date);
      return '';
    }
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', month: 'long', day: 'numeric'
    };
    return new Intl.DateTimeFormat('fr-FR', options).format(dateObj);
  }

  supprimerEntreprise(id: string): void {
    if (this.authService.isAdmin()) {
      console.log('Checking appeloffres for entreprise with ID (admin):', id);
      this.appeloffreService.getAppelOffresByEntrepriseId(id).subscribe({
        next: (appeloffres) => {
          if (appeloffres && appeloffres.length > 0) {
            this.toastr.warning('Vous devez supprimer les offres associés à cette entreprise avant de pouvoir la supprimer.', 'Erreur', {
              timeOut: 5000,
              closeButton: true,
              progressBar: true,
              positionClass: 'toast-top-right',
            });
          } else {
            this.deleteEntreprise(id);
          }
        },
        error: (error) => {
          console.warn('Error checking appeloffres for entreprise (admin):', error);
        }
      });
    } else {
      console.log('Directly deleting entreprise without checking appeloffres (non-admin):', id);
      this.deleteEntreprise(id);
    }
  }

  deleteEntreprise(id: string): void {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Voulez-vous vraiment supprimer cette entreprise?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#28a745', // Green color
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.supprimerEntreprise(id).subscribe({
          next: () => {
            this.toastr.success("Entreprise supprimée avec succès", "Entreprise", {
              timeOut: 5000,
              closeButton: true,
              progressBar: true,
              positionClass: 'toast-top-right',
            });
            console.log('Entreprise deleted successfully');
            this.loadCurrentUser(this.userId); // Reload the page after successful deletion
          },
          error: (error) => {
            this.toastr.error("Erreur lors de la suppression de l'entreprise", "Entreprise", {
              timeOut: 5000,
              closeButton: true,
              progressBar: true,
              positionClass: 'toast-top-right',
            });
            console.warn('Error deleting entreprise:', error);
            this.loadCurrentUser(this.userId); // Reload the page even if an error occurs
          }
        });
      }
    });
  }
}
