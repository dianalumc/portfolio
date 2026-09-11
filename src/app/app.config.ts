import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home-page';
import { ContactPage } from './pages/contact-page/contact-page';
import { ProjectDetail } from './pages/project-detail/project-detail';

const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'contacto', component: ContactPage },
  { path: 'proyectos/:slug', component: ProjectDetail },
  { path: '**', redirectTo: '' },
];

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), provideRouter(routes)],
};
