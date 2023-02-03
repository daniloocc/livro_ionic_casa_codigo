import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente } from 'src/app/models/cliente.model';
import { OrdemDeServico } from 'src/app/models/ordemdeservico.model';
import { ClientesService } from 'src/app/services/clientes.service';
//import { DatePicker } from '@ionic-native/date-picker/ngx'
import { Platform } from '@ionic/angular';
import { Guid } from 'guid-typescript';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdensDeServicoService } from 'src/app/services/ordensdeservico.service';
import { AlertService } from 'src/app/services/alert.service';
import { ToastService } from 'src/app/services/toast.service';
import { min } from 'rxjs';

@Component({
  selector: 'app-ordensdeservico-add-edit',
  templateUrl: './ordensdeservico-add-edit.page.html',
  styleUrls: ['./ordensdeservico-add-edit.page.scss'],
})
export class OrdensDeServicoAddEditPage implements OnInit {

  public ordemDeServico: OrdemDeServico;
  public modoDeEdicao = false;
  public osForm: FormGroup;
  public clientes: Cliente[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private clientesService: ClientesService,
    //private datePicker: DatePicker,
    private platform: Platform,
    private route: ActivatedRoute,
    private router: Router,
    private ordensDeServicoService: OrdensDeServicoService,
    private alertService: AlertService,
    private toastService: ToastService

  ) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    const id = <string>this.route.snapshot.paramMap.get('id');
    const clientes = await this.clientesService.getAll();
    this.clientes = clientes;

    console.log("cliente lista =>", clientes)

    const isIdEmptyGUID = Guid.parse(id).isEmpty();
    const isIdValidGUID = Guid.isGuid(id);

    if (id && !isIdEmptyGUID && isIdValidGUID) {
      this.ordemDeServico = await this.ordensDeServicoService.getById(id);
    } else {
      this.ordemDeServico = {
        ordemdeservicoid: Guid.createEmpty().toString(),
        clienteid: Guid.createEmpty().toString(),
        veiculo: '',
        dataehoraentrada: new Date()
      };
      this.iniciarEdicao();
    }

    this.osForm = this.formBuilder.group({
      ordemdeservicoid: [this.ordemDeServico.ordemdeservicoid],
      clienteid: [this.ordemDeServico.clienteid, Validators.required],
      veiculo: [this.ordemDeServico.veiculo, Validators.required],
      dataentrada: [{ value: this.ordemDeServico.dataehoraentrada.toLocaleDateString(), disabled: !this.modoDeEdicao }, Validators.required],
      horaentrada: [{ value: this.ordemDeServico.dataehoraentrada.toLocaleTimeString(), disabled: !this.modoDeEdicao }, Validators.required],
      dataehoraentrada: [this.ordemDeServico.dataehoraentrada]
    });

    console.log("this.ordemDeServico.dataehoraentrada.toLocaleDateString() => ", this.ordemDeServico.dataehoraentrada.toLocaleDateString())
    console.log("this.ordemDeServico.dataehoraentrada.toLocaleTimeString() => ", this.ordemDeServico.dataehoraentrada.toLocaleTimeString())

  }
  teste() { console.log('selecionou uma data') }
  /*
    selecionarDataEntrada() {
      if (!this.modoDeEdicao) {
        return;
      }
  
      this.platform.ready().then(() => {
        if (this.platform.is('capacitor')) {
          this.datePicker.show({
            date: new Date(),
            mode: 'date',
            locale: 'pt-br',
            doneButtonLabel: 'Confirmar',
            cancelButtonLabel: 'Cancelar'
          })
            .then(data => {
              this.osForm.controls['dataentrada'].setValue(data.toLocaleDateString());
            });
        } else {
          //  instruções para execução no browser
        }
      });
    }
  
    selecionarHoraEntrada() {
      if (!this.modoDeEdicao) {
        return;
      }
  
      this.platform.ready().then(() => {
        if (this.platform.is('capacitor')) {
          this.datePicker.show({
            date: new Date(),
            mode: 'time',
            locale: 'pt-br',
            doneButtonLabel: 'Confirmar',
            cancelButtonLabel: 'Cancelar'
          })
            .then(data => {
              const dataEHoraEntrada = new Date(this.osForm.controls['dataehoraentrada'].value);
              dataEHoraEntrada.setHours(data.getHours());
              dataEHoraEntrada.setMinutes(data.getMinutes());
  
              this.osForm.controls['horaentrada'].setValue(data.toLocaleTimeString());
              this.osForm.controls['dataehoraentrada'].setValue(dataEHoraEntrada.toISOString());
            });
        } else {
          // instruções para execução no navegador
        }
      });
    }
    //*/

  iniciarEdicao() {
    this.modoDeEdicao = true;
  }

  cancelarEdicao() {
    this.modoDeEdicao = false;
    this.osForm.setValue(this.ordemDeServico);
  }

  async submit() {
    if (this.osForm.invalid || this.osForm.pending) {
      await this.alertService.presentAlert('Falha', 'Gravação não foi executada', 'verifique os dados informados para o atendimento', ['Ok']);
      return;
    }
    const dataString = this.osForm.controls['dataentrada'].value;
    const horaString = this.osForm.controls['horaentrada'].value;

    /** WORKAROUND conversão data */
    const [day, month, year] = dataString.split('/');
    const [hour, minute, second] = horaString.split(':');
    const dataeHora = new Date(+year, month - 1, +day, hour, minute, second);
    /** FIM WORKAROUND */

    await this.ordensDeServicoService.update({
      ordemdeservicoid: this.osForm.controls['ordemdeservicoid'].value,
      clienteid: this.osForm.controls['clienteid'].value,
      veiculo: this.osForm.controls['veiculo'].value,
      dataehoraentrada: dataeHora
    });

    this.toastService.presentToast('Gravação Bem Sucedida', 3000, 'top');
    this.router.navigateByUrl('/ordensdeservico-listagem');
  }

}
