import { Injectable } from '@angular/core';
import { Cita } from '../modelo/cita';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import { NumericValueAccessor } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CitaService {

  sqlite:SQLiteConnection = new SQLiteConnection(CapacitorSQLite)
  db: any;

  plataforma:string = "";

  DB_NAME: string         = "lista_citas";
  DB_ENCRIPTADA: boolean  = false;
  DB_MODE: string         = "no-encryption";
  DB_VERSION: number      = 1;
  DB_READ_ONLY: boolean   = false;
  TABLE_NAME: string      = "lista_citas"
  COL_ID: string           = "id"
  COL_FRASE: string      = "frase"
  COL_AUTOR: string       = "autor"
  DB_SQL_TABLAS: string = `
   CREATE TABLE IF NOT EXISTS ${this.TABLE_NAME} (
     ${this.COL_ID} INTEGER PRIMARY KEY AUTOINCREMENT,
     ${this.COL_FRASE} TEXT NOT NULL,
     ${this.COL_AUTOR} TEXT NOT NULL
   );
 `;

  
  constructor(

  ) { }

  private async _iniciarPluginWeb(): Promise<void> {
    await customElements.whenDefined('jeep-sqlite')
    const jeepSqliteE1 = document.querySelector("jeep-sqlite")
    if (jeepSqliteE1 != null) {
      await this.sqlite.initWebStore()
    }
  }

  async iniciarPlugin() {
    this.plataforma = Capacitor.getPlatform()
    if (this.plataforma == "web") {
      await this._iniciarPluginWeb()
    }
    await this.abrirConexion()
    await this.db.execute(this.DB_SQL_TABLAS)

    await this.agregarCita({frase:"El éxito consiste en obtener lo que se desea. La felicidad en disfrutar lo que se obtiene.", autor:"Ralph Waldo Emerson"})
    await this.agregarCita({frase:"Las personas no son recordadas por el número de veces que fracasan, sino por el número de veces que tienen éxito.", autor:"Thomas Edison"})
    await this.agregarCita({frase:"Ningún viento es bueno para el barco que no sabe adonde va", autor:"Séneca"})

  }

  async abrirConexion () {
    const ret = await this.sqlite.checkConnectionsConsistency() 
    const isConn = (await this.sqlite.isConnection(this.DB_NAME, this.DB_READ_ONLY)).result
    if(ret.result && isConn) {
      this.db = await this.sqlite.retrieveConnection(this.DB_NAME, this.DB_READ_ONLY)      
    } else {
      this.db = await this.sqlite.createConnection(
        this.DB_NAME,
        this.DB_ENCRIPTADA,
        this.DB_MODE,
        this.DB_VERSION,
        this.DB_READ_ONLY
      )
    }
    await this.db.open()
  }

  async agregarCita(cita: Cita) {
    cita.id = Date.now();  // Asigna un valor a id
    const sql = `INSERT INTO ${this.TABLE_NAME} (${this.COL_FRASE}, ${this.COL_AUTOR}) VALUES (?, ?)`;
    await this.db.run(sql, [cita.frase, cita.autor]);
  }

  async getCitas(): Promise<Cita[]> {
    try {
        if (!this.db || !this.db.query) {
            throw new Error('La conexión a la base de datos no está disponible.');
        }

        const resultado = await this.db.query(`SELECT * FROM ${this.TABLE_NAME}`);
        console.log('Resultado de la consulta:', resultado);
        return resultado?.values ?? [];
    } catch (error) {
        console.error('Error al realizar la consulta:', error);
        return [];
    }
}

  async eliminar(id: number): Promise<void> {
    const sql = `DELETE FROM ${this.TABLE_NAME} WHERE ${this.COL_ID} = ?`;
    await this.db.run(sql, [id]);
  }
  
  async guardarCitas(citas: Cita[]): Promise<void> {
    const batch = citas.map(cita => ({
      statement: `INSERT OR REPLACE INTO ${this.TABLE_NAME} (${this.COL_FRASE}, ${this.COL_AUTOR}, id) VALUES (?, ?, ?)`,
      values: [cita.frase, cita.autor, cita.id]
    }));
  
    await this.db.executeBatch({ statements: batch });
  }
}