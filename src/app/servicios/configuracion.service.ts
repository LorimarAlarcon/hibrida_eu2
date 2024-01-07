import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';


@Injectable({
  providedIn: 'root'
})

export class ConfiguracionService {
private readonly KEY_BORRAR = "BORRAR";

constructor() { }

async permitirBorrarCitasInicio(): Promise<boolean> {
  try {
    const resultado = await Preferences.get({ key: this.KEY_BORRAR });
    return resultado?.value === "true" ?? false;
  } catch (error) {
    console.error("Error al obtener preferencia", error);
    return false;
  }
}

async setPermitirBorrarCitasInicio(permitirBorrarCitasInicio: boolean): Promise<void> {
  try {
    await Preferences.set({
      key: this.KEY_BORRAR,
      value: permitirBorrarCitasInicio ? "true" : "false"
    });
  } catch (error) {
    console.error("Error al establecer preferencia", error);
  }
}
}
