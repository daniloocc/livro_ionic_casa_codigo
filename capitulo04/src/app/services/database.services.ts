import { Injectable } from '@angular/core';
import { SQLiteConnection, SQLiteDBConnection, CapacitorSQLite, CapacitorSQLitePlugin } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import { createClientesTable, createOrdensDeServicoTable } from './database.statements';
import { Guid } from 'guid-typescript';


@Injectable({
    providedIn: 'root'
})
export class DatabaseService {

    sqliteConnection: SQLiteConnection;
    platform: string;
    native: boolean = false;
    sqlitePlugin: any;

    async initializePlugin(): Promise<boolean> {
        return new Promise(resolve => {
            this.platform = Capacitor.getPlatform();
            if (this.platform === 'ios' || this.platform === 'android') // TODO implementar para funcionar na web
                this.native = true;
            this.sqlitePlugin = CapacitorSQLite;
            this.sqliteConnection = new SQLiteConnection(this.sqlitePlugin);
            resolve(true);
        })
    }

    async createConnection(database: string, encrypted: boolean, mode: string, version: number, readonly: boolean): Promise<SQLiteDBConnection> {

        if (this.sqliteConnection != null) {
            try {
                const db: SQLiteDBConnection = await this.sqliteConnection.createConnection(database, encrypted, mode, version, readonly);
                if (db != null) {
                    console.log("##Foi criada a database##");
                    await this.createSchema(db);
                    return Promise.resolve(db);
                } else {
                    console.log("##Não Foi criada a database##");
                    return Promise.reject(new Error('Erro ao criar a conexão'));
                }
            } catch (err) {
                console.log("##Deu erro e não Foi criada a database##");
                return Promise.reject(err);
            }
        } else {
            console.log("##Não Foi criada a database##");
            return Promise.reject(new Error(`Nenhuma conexão disponível para ${database}`));
        }

    }

    private async createSchema(db: SQLiteDBConnection): Promise<void> {
        await db.open();
        let createClienteSchema: any = await db.execute(createClientesTable);
        let createOSSchema: any = await db.execute(createOrdensDeServicoTable);

        await this.populateDatabase(db);
        await db.close();

        console.log('Fechou Conexão');

        if (createOSSchema.changes.changes < 0 || createClienteSchema.changes.changes < 0) {
            return Promise.reject(new Error("Erro na criação das tabelas"));
        }
        return Promise.resolve();
    }

    private async populateDatabase(db: SQLiteDBConnection): Promise<void> {
        const clienteId = Guid.create().toString();

        await this.populateClientes(db, clienteId);
        await this.populateOrdensDeServico(db, clienteId);

        return Promise.resolve();
    }

    private async populateOrdensDeServico(db: SQLiteDBConnection, clienteId: string): Promise<void> {
        let returnQuery = await db.query("SELECT count(ordemdeservicoid) as qtdeOS FROM ordensdeservico;");

        if (returnQuery.values && returnQuery.values[0].qtdeOS === 0) {
            let sqlcmd: string = "INSERT INTO ordensdeservico (ordemdeservicoid, clienteid, veiculo, dataehoraentrada, dataehoratermino) VALUES ( ?, ?, ?, ?, ? )";
            let values: Array<any> = [Guid.create().toString(), clienteId, 'ABC-1235', Date.now(), null];

            let returnInsert = await db.run(sqlcmd, values);

            if (returnInsert.changes && returnInsert.changes < 0) {
                return Promise.reject(new Error("Erro na inserção da ordem de serviço"));
            }
        }
        return Promise.resolve();
    }

    private async populateClientes(db: SQLiteDBConnection, clienteId: string): Promise<void> {
        let returnQuery = await db.query("SELECT count(clienteId) as qtdeClientes FROM clientes");

        if (returnQuery.values && returnQuery.values[0].qtdeClientes === 0) {
            let sqlcmd: string = 'INSERT INTO clientes(clienteId, nome, email, telefone, renda) VALUES (?, ?, ?, ?, ?)';
            let values: Array<any> = [clienteId, 'Ambrózio', 'ambrozio@casadocodigo.com.br', '91123998', 123];

            let returnInsert = await db.run(sqlcmd, values);
            if (returnInsert.changes && returnInsert.changes < 0) {
                return Promise.reject(new Error("Erro na inserção de clientes"));
            }
        }

        return Promise.resolve();
    }

}