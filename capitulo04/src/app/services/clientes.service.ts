import { Injectable } from "@angular/core";
import { DatabaseService } from "./database.services";
import { databaseName } from "./database.statements";
import { Cliente } from "../models/cliente.model";

@Injectable({
    providedIn: 'root'
})
export class ClientesService {
    constructor(
        private databaseServices: DatabaseService
    ) { }

    public async getAll() {
        console.log("$### antes do retrieve");
        const db = await this.databaseServices.sqliteConnection.retrieveConnection(databaseName, false);
        console.log("$### depois do retrieve");

        db.open();
        let returnQuery = await db.query("SELECT * FROM clientes ORDER BY nome");
        db.close();

        if (returnQuery.values && returnQuery.values.length > 0) {
            let clientes: Cliente[] = [];
            for (let i = 0; i < returnQuery.values.length; i++) {
                const cliente = returnQuery.values[i];
                // console.log(`OS> ${ordemdeservico}`);
                clientes.push(cliente)
            }
            return clientes;
        }
        return [];
    }



}