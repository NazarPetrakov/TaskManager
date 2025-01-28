import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'signIn', component: SignInComponent},
    {path: 'signUp', component: SignUpComponent},
    // {
    //     path: '',
    //     children: [
    //         {}
    //     ]
    // }
];
