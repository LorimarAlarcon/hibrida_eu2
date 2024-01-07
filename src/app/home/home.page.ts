import { Component, OnInit } from '@angular/core';
import { IonText, IonCardContent, IonCard, IonFabButton, IonFab, IonButtons, IonButton, IonIcon, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { settingsOutline, addCircleOutline } from 'ionicons/icons';
import { Router, RouterModule } from '@angular/router';
import { CitaService } from '../servicios/cita.service';
import { ConfiguracionService } from '../servicios/configuracion.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [ IonText, RouterModule, IonCardContent, IonCard, IonFabButton, IonFab, IonButtons, IonButton, IonIcon, IonHeader, IonToolbar, IonTitle, IonContent]
})
export class HomePage implements OnInit {

  citaAleatoria: string | undefined;
  permitirBorrarCitasInicio: boolean | undefined

  constructor(
    private citaService: CitaService,
    public configuracionService: ConfiguracionService,
    private router: Router
  ) {
    addIcons({
      settingsOutline,
      addCircleOutline
    })
  }

  ngOnInit(): void {
    this.obtenerCitaAleatoria();
    this.configuracionService.permitirBorrarCitasInicio().then((permitir) => {
      this.permitirBorrarCitasInicio = permitir;
    });
  }

  async obtenerCitaAleatoria() {
    try {
      const citas = await this.citaService.getCitas();
      if (!citas || citas.length === 0) {
        this.citaAleatoria = 'No hay citas disponibles.';
        return;
      }
  
      const indice = Math.floor(Math.random() * citas.length);
      const cita = citas[indice];
  
      if (cita && cita.frase && cita.autor) {
        this.citaAleatoria = `${cita.frase} - ${cita.autor}`;
      } else {
        this.citaAleatoria = 'Cita no válida.';
      }
    } catch (error) {
      console.error('Error al obtener citas:', error);
      this.citaAleatoria = 'Error al obtener citas.';
    }
  }
}