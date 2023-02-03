import { Injectable } from "@angular/core";
import { TipoServicoType } from "../models/tipo-servicos.model";

@Injectable({
    providedIn: 'root'
})
export class TipoServicosService {

    private tiposServicos: TipoServicoType[] = [
        { id: 1, nome: 'Alinhamento', valor: 30 },
        { id: 2, nome: 'Balanceamento', valor: 30 },
        { id: 3, nome: 'Revisão de Freios', valor: 25 },
        { id: 4, nome: 'Suspensão', valor: 40 },
        { id: 5, nome: 'Vulcanização', valor: 150 },
        { id: 6, nome: 'Recapagem', valor: 110 },
        { id: 7, nome: 'Recauchutagem', valor: 100 },
        { id: 8, nome: 'Remoldagem', valor: 80 },
        { id: 9, nome: 'Serviços de Molas', valor: 150 },
        { id: 10, nome: 'Serviços de Amortecedores', valor: 180 },
        { id: 11, nome: 'Serviços de Barras estabilizadoras', valor: 190 },
        { id: 12, nome: 'Serviços de Pinos esféricos (pivôs)', valor: 200 },
        { id: 13, nome: 'Serviços de Bandejas de suspensão', valor: 180 },
    ];

    constructor() { }

    private getIndexOfElement(id: number) {
        return this.tiposServicos.indexOf(this.getById(id));
    }

    getById(id: number): TipoServicoType {
        const tipoServicoSelecionado = this.tiposServicos.filter(
            tipoServico => tipoServico.id === id
        );
        return tipoServicoSelecionado[0];
    }

    update(tipoServico: TipoServicoType) {
        if (tipoServico.id < 0) {
            // FIX consertar a inserção quando a lista está vazia
            tipoServico.id = this.tiposServicos[this.tiposServicos.length - 1].id + 1;
            this.tiposServicos.push(tipoServico);
        } else {
            this.tiposServicos[this.getIndexOfElement(tipoServico.id)] = tipoServico;
        }
    }

    remove(tipoServico: TipoServicoType) {
        this.tiposServicos.splice(this.getIndexOfElement(tipoServico.id), 1);
    }

    getAll(): TipoServicoType[] {
        return this.tiposServicos;
    }
}