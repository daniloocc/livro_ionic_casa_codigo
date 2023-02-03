import { Component, OnInit, ViewChild } from '@angular/core';
import { IonList } from '@ionic/angular';
import { Guid } from 'guid-typescript';
import { Peca } from 'src/app/models/peca.model';
import { PecasService } from 'src/app/services/pecas.service';
import { ToastService } from 'src/app/services/toast.service';


@Component({
  selector: 'app-pecas-listagem',
  templateUrl: './pecas-listagem.page.html',
  styleUrls: ['./pecas-listagem.page.scss'],
})
export class PecasListagemPage implements OnInit {

  public pecas: any;
  @ViewChild('slidingList') slidingList: IonList;

  constructor(
    private pecasServices: PecasService,
    private toastService: ToastService
  ) { }

  idAsString(id: Guid): string {
    const convertedId = JSON.parse(JSON.stringify(id));
    return convertedId.value;
  }

  ngOnInit() {
    this.pecasServices.getAll().then(pecas => {
      this.pecas = pecas;
    });
  }

  ionViewWillEnter() {
    this.pecasServices.getAll().then(pecas => {
      this.pecas = pecas;
    })
  }

  async removerPeca(peca: any) {
    await this.pecasServices.removeById(this.idAsString(peca.id));
    this.pecas = await this.pecasServices.getAll();
    this.toastService.presentToast('Peça Removida', 3000, 'top');
    await this.slidingList.closeSlidingItems();
  }

}
