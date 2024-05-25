import { User } from "./user.model";

export class Entreprise {
    id!: string;
    name!: string;
    adresse!: string;
    secteuractivite!: string;
    matricule!: string; 
    ville!: string;
    siegesociale!: string;
    codeTVA!: string;
    logo: any; 
    logoUrl?: string; // Add this line
    users!: User[];
    codetvadocument!: string;
    status!: string;
}
