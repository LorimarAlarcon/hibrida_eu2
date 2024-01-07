import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Cita } from 'src/app/modelo/cita';
import { CitaService } from 'src/app/servicios/cita.service';
import { IonContent, IonList, IonItem, IonLabel, IonButton, IonIcon } from '@ionic/angular/standalone';
import { CitaFormComponent } from '../cita-form/cita-form.component';
import { ConfiguracionService } from 'src/app/servicios/configuracion.service';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { trashOutline} from 'ionicons/icons';

@Component({
  selector: 'app-cita-list',
  templateUrl: './cita-list.component.html',
  styleUrls: ['./cita-list.component.scss'],
  standalone: true,
  imports: [CommonModule, CitaFormComponent, IonContent, IonList, IonItem, IonLabel, IonButton, IonIcon]
})
export class CitaListComponent implements OnInit {
  @Input() citas: Cita[] = [];
  @Output() eliminarCita= new EventEmitter<number>();

  constructor(private citaService: CitaService, private configuracionService: ConfiguracionService) {
    addIcons({
      trashOutline})
  }

  ngOnInit(): void {
    this.cargarCitas();
  }

  async cargarCitas() {
    this.citas = await this.citaService.getCitas();
  }
}