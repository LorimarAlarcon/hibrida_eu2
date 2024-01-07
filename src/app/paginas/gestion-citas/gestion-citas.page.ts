import { Component, OnInit, ViewChild } from '@angular/core';
import { IonCard, IonItem, IonBackButton, IonButtons, IonButton, IonIcon, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { CitaListComponent } from 'src/app/componentes/cita-list/cita-list.component';
import { CitaFormComponent } from 'src/app/componentes/cita-form/cita-form.component';
import { Cita } from 'src/app/modelo/cita';
import { CitaService } from 'src/app/servicios/cita.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-gestion-citas',
  templateUrl: './gestion-citas.page.html',
  styleUrls: ['./gestion-citas.page.scss'],
  standalone: true,
  imports: [ IonCard, IonItem, IonBackButton, CitaFormComponent, CitaListComponent, IonButtons, IonButton, IonIcon, IonHeader, IonToolbar, IonTitle, IonContent]
})
export class GestionCitasPage implements OnInit {

  listaCitas: Cita[] = [];
  servicioInicializado = false;

  constructor(private citaService: CitaService) {}

  async ngOnInit() {
    if (!this.servicioInicializado) {
      await this.citaService.iniciarPlugin();
      this.servicioInicializado = true;
    }
  }

    async ionViewWillEnter() {
    await this._actualizarCitas();
  }

  async _actualizarCitas() {
    this.listaCitas = await this.citaService.getCitas();
    console.log('Lista de citas:', this.listaCitas);
  }

  async onCreateCita(nuevaCita: Cita) {
    this.citaService.agregarCita(nuevaCita);
    await this._actualizarCitas(); // Espera a que se actualicen las citas antes de continuar
  }

  
  async eliminarCita(id: number) {
    await this.citaService.eliminar(id);
    await this._actualizarCitas();
  }
}