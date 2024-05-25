import { Component, OnInit } from '@angular/core';
import { User } from '../model/user.model';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  allUsers! : User[];
  nomUser! : string;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.listeUsers().subscribe(data => {
      this.users = data;
      this.allUsers = data; // Update allUsers property here
    });
  }

  getImage(img: any): string {
    return 'data:image/jpeg;base64,' + img;
  }

  loadUsers(): void {
    this.userService.listeUsers().subscribe((res) => {
      this.users = res.map(user => {
        console.log('User img:', user.img); // Debug log before modification
        if (user.img && !user.img.startsWith('data:image/jpeg;base64,')) {
          user.img = 'data:image/jpeg;base64,' + user.img;
        }
        console.log(user);
        console.log('Modified user img:', user.img); // Debug log after modification
        return user;
      });
    });
  }

  getRoleNames(user: User): string {
    return user.roles.map(role => role.name).join(', ');
  }

  onKeyUp(filterText: string): void {
    this.users = this.allUsers.filter(item =>
      item.name?.toLowerCase().includes(filterText.toLowerCase())
    );
  }

  rechercherUsers(): void {
    this.userService.rechercherParNom(this.nomUser).subscribe(users => {
      this.users = users;
      console.log(users);
    });
  }

  supprimerUser(id: string): void {
    console.log('Deleting user with ID:', id);
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Voulez-vous vraiment supprimer cet utilisateur?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#28a745', // Green color
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.supprimerUser(id).subscribe(() => {
          console.log('User deleted successfully');
          this.loadUsers(); // Reload the users list after successful deletion
          Swal.fire(
            'Supprimé!',
            'L\'utilisateur a été supprimé.',
            'success'
          );
        }, (error) => {
          console.warn('Error deleting user:', error); // Log as warning instead of error
          Swal.fire(
            'Erreur!',
            'Une erreur s\'est produite lors de la suppression de l\'utilisateur.',
            'error'
          );
        });
      }
    });
  }
}
