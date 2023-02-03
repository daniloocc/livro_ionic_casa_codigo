import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { DatabaseService } from './services/database.services';
import { databaseName } from './services/database.statements';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  private initPlugin: boolean;

  pages = [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: '/assets/imgs/icon_dashboard.png'
    },
    {
      title: 'Tipos de Serviços',
      url: '/tipo-servicos-listagem',
      icon: '/assets/imgs/icon_tiposservicos.png'
    },
    {
      title: 'Peças',
      url: '/pecas-listagem',
      icon: '/assets/imgs/tab_pecas.png'
    },
    {
      title: 'Atendimentos',
      url: '/ordensdeservico-listagem',
      icon: '/assets/imgs/icon_atendimentos.png'
    }
  ];

  selectedIndex: number;

  constructor(
    private storage: Storage,
    private platform: Platform,
    private databaseService: DatabaseService
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    this.platform.ready().then(async () => {
      this.databaseService.initializePlugin().then(async (ret) => {
        try {
          const db = await this.databaseService.createConnection(databaseName, false, "no-encryption", 1, false);
          this.initPlugin = ret;
        } catch (err) {
          console.log(`Err: ${err}`);
          this.initPlugin = false;
        }
        console.log('Status da inicialização do plugin: ' + this.initPlugin);
      });
    })
  }

  async ngOnInit() {
    await this.storage.create();
  }

}
