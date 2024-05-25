import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { UsersComponent } from './users/users.component';
import { LoginComponent } from './login/login.component';
import { AddUserComponent } from './add-user/add-user.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ProfileComponent } from './profile/profile.component';
import { AddentrepriseComponent } from './addentreprise/addentreprise.component';
import { NavbarComponent } from './navbar/navbar.component';
import { UpdateEntrepriseComponent } from './update-entreprise/update-entreprise.component';
import { AddappeloffreComponent } from './addappeloffre/addappeloffre.component';
import { DetailsappeloffreComponent } from './detailsappeloffre/detailsappeloffre.component';
import { AppeloffresadminComponent } from './appeloffresadmin/appeloffresadmin.component';
import { UpdateappeloffreComponent } from './updateappeloffre/updateappeloffre.component';
import { AddoffreComponent } from './addoffre/addoffre.component';
import { DetailsappeloffreadminComponent } from './detailsappeloffreadmin/detailsappeloffreadmin.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { AuthGuard } from './guards/auth.guard';
import { SuperAdminGuard } from './guards/superadmin.guard';
import { ActionentrepriseComponent } from './actionentreprise/actionentreprise.component';
import { DemandecreationentrepriseComponent } from './demandecreationentreprise/demandecreationentreprise.component';
import { DemanderejointentrepriseComponent } from './demanderejointentreprise/demanderejointentreprise.component';
import { HomevisitorComponent } from './homevisitor/homevisitor.component';
import { ListentreprisesComponent } from './listentreprises/listentreprises.component';
import { GestioncategoriesComponent } from './gestioncategories/gestioncategories.component';
import { AdminGuard } from './guards/admin.guard';



const routes: Routes = [
  {path:"addOffre/:id",component:AddoffreComponent},
  {path:"gestioncategories",component:GestioncategoriesComponent,canActivate: [SuperAdminGuard]},
  {path:"demandecreationentreprise",component:DemandecreationentrepriseComponent,canActivate: [AuthGuard]},
  {path:"demanderejointentreprise",component:DemanderejointentrepriseComponent,canActivate: [AuthGuard]},
  {path:"actionentreprise",component:ActionentrepriseComponent,canActivate: [AuthGuard]},
  {path:"addAppelOffre/:id",component:AddappeloffreComponent,canActivate: [AdminGuard]},
  {path:"detailsAppelOffre/:id",component:DetailsappeloffreComponent,canActivate: [AuthGuard]},
  {path:"detailsAppelOffreAdmin/:id",component:DetailsappeloffreadminComponent,canActivate: [AdminGuard]},
  {path:"appeloffresadmin/:id",component:AppeloffresadminComponent,canActivate: [AdminGuard]},
  {path:"home", component:HomeComponent ,canActivate: [AuthGuard]},
  {path:"users",component:UsersComponent,canActivate: [SuperAdminGuard]},
  {path: "updateUser/:id", component: UpdateUserComponent,canActivate: [AuthGuard]},
  {path:"updateappeloffre/:id",component:UpdateappeloffreComponent,canActivate: [AdminGuard]},
  {path:"updateEntreprise/:id",component:UpdateEntrepriseComponent,canActivate: [AdminGuard]},
  {path:"profile",component:ProfileComponent,canActivate: [AuthGuard]},
  { path: 'navbar', component: NavbarComponent } ,
  {path:"login", component:LoginComponent},
  {path:"signUp",component:SignUpComponent},
  {path:"listentreprises",component:ListentreprisesComponent},
  {path:"forbidden",component:ForbiddenComponent},
  {path:"about", component:AboutComponent},
  { path: 'homevisitor', component: HomevisitorComponent } ,
  { path: '', component: HomevisitorComponent } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
