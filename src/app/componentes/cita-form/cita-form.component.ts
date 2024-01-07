import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IonCardSubtitle, IonContent, IonCard, IonItem, IonInput, IonCardContent, IonList, IonButton, IonIcon, IonLabel, IonText } from '@ionic/angular/standalone'
import { FormsModule } from '@angular/forms'
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons'
import { Cita } from 'src/app/modelo/cita';
import { CommonModule } from '@angular/common';
import { CitaService } from 'src/app/servicios/cita.service';
import { ConfiguracionService } from 'src/app/servicios/configuracion.service';



@Component({
  selector: 'app-cita-form',
  templateUrl: './cita-form.component.html',
  styleUrls: ['./cita-form.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonCardSubtitle, IonContent, IonCard, IonItem, IonInput, IonCardContent, IonList, IonButton, IonIcon, IonLabel, IonText]
})
export class CitaFormComponent implements OnInit {
  cita: Cita = {
    id: 0,
    frase: '',
    autor: ''
  };
  mensajeErrorFrase: string = '';
  mensajeErrorAutor: string = '';

  @Output() onCitaAgregada = new EventEmitter<Cita>();

  constructor(private citaService: CitaService) {
    addIcons({
      addOutline
    });
  }

  ngOnInit() {}

  async onClick() {
    if (this.validarFormulario()) {
      await this.citaService.agregarCita(this.cita);
      this.onCitaAgregada.emit(this.cita);
      this.cita = { id: 0, frase: '', autor: '' };
    }
  }

  validarFormulario(): boolean {
    this.mensajeErrorFrase = '';
    this.mensajeErrorAutor = '';

    if (this.cita.frase.trim().length < 5) {
      this.mensajeErrorFrase = 'La frase debe tener al menos 5 caracteres.';
    }

    if (this.cita.autor.trim().length < 2) {
      this.mensajeErrorAutor = 'El autor debe tener al menos 2 caracteres.';
    }

    return this.mensajeErrorFrase === '' && this.mensajeErrorAutor === '';
  }
}
