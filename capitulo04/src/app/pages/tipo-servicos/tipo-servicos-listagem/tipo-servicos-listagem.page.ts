import { Component, OnInit, ViewChild } from '@angular/core';
import { IonList } from '@ionic/angular';
import { TipoServicoType } from 'src/app/models/tipo-servicos.model';
import { TipoServicosService } from 'src/app/services/tipo-servicos.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-tipo-servicos-listagem',
  templateUrl: './tipo-servicos-listagem.page.html',
  styleUrls: ['./tipo-servicos-listagem.page.scss'],
})
export class TipoServicosListagemPage implements OnInit {

  @ViewChild('slidingList') slidingList: IonList;

  public tiposServicos: TipoServicoType[];

  constructor(
    private tiposServicosService: TipoServicosService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.tiposServicos = this.tiposServicosService.getAll();
  }

  async removerTipoServico(tipoServico: TipoServicoType) {
    this.tiposServicosService.remove(tipoServico);
    this.toastService.presentToast('Tipo de serviço removido', 3000, 'top');
    await this.slidingList.closeSlidingItems();
  }

}
