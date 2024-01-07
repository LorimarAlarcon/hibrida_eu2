import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToggleChangeEventDetail } from '@ionic/angular';
import { IonToggleCustomEvent } from '@ionic/core'
import { ConfiguracionService } from 'src/app/servicios/configuracion.service';  
import { CitaService } from 'src/app/servicios/cita.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule]
})
export class ConfiguracionPage implements OnInit {

  permitirBorrarCitasInicio:boolean = false

  constructor(
    private configuracionService:ConfiguracionService,
    private citasService: CitaService,
    private router: Router
  ) { }

  async ngOnInit() {
    this.permitirBorrarCitasInicio = await this.configuracionService.permitirBorrarCitasInicio()
  }

  async onCambioEnConfiguracionAleatoria(
    $event: IonToggleCustomEvent<ToggleChangeEventDetail<any>>
  ) {
    await this.permitirBorrarCitasInicio === $event.detail.checked;
    await this.configuracionService.setPermitirBorrarCitasInicio(
      this.permitirBorrarCitasInicio
    );
  }
}
