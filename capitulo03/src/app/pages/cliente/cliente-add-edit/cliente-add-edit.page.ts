import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Platform } from '@ionic/angular';
import { IonDatetimeCustomEvent } from '@ionic/core';

@Component({
  selector: 'app-cliente-add-edit',
  templateUrl: './cliente-add-edit.page.html',
  styleUrls: ['./cliente-add-edit.page.scss'],
})
export class ClienteAddEditPage implements OnInit {

  //@ViewChild('inputNome', { read: ElementRef }) nome: ElementRef;
  clienteForm: FormGroup;
  dataSelecionada: string;

  /*hasErrors = false;
  errorsMessage: string[];//*/

  validationMessages = {
    nome: [
      { type: 'required', message: 'Nome é obrigatório' },
      { type: 'minlength', message: 'O nome deve ter ao menos 3 caracteres' },
      { type: 'maxlength', message: 'O nome deve ter no máximo 50 caracteres' },
    ],
    email: [
      { type: 'required', message: 'Email é obrigatório' },
      { type: 'email', message: 'Informe um email válido' }
    ],
    telefone: [{ type: 'required', message: 'Telefone é obrigatório' },],
    renda: [
      { type: 'required', message: 'Renda é obrigatório' },
      { type: 'min', message: 'Renda precisa ser positiva' }
    ],
    nascimento: [
      { type: 'required', message: 'Nascimento é obrigatório' },
    ]
  };

  constructor(
    private formBuilder: FormBuilder,
    private datePicker: DatePicker,
    private platform: Platform
  ) {
  }

  ngOnInit() {
    this.clienteForm = this.formBuilder.group({
      nome: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      telefone: ['', Validators.required],
      renda: ['', Validators.compose([Validators.required, Validators.min(0)])],
      nascimento: [{ value: '', disabled: !this.isBrowserPlatform }, Validators.required],
    });

  }

  confirmarData(): string {
    console.log('evento => ', event)
    // TODO
    return 'event.target';
  }

  selecionarData() {
    this.platform.ready().then(() => {
      if (this.platform.is('capacitor')) {
        this.datePicker.show({
          date: new Date(),
          mode: 'date',
          locale: 'pt-br',
          doneButtonLabel: 'Confirmar',
          cancelButtonLabel: 'Cancelar',
        }).then(data => this.clienteForm.controls['nascimento'].setValue(data.toLocaleDateString()));
      } else {
        console.log('TODO: instruções para executar no navegador')
      }
    })

  }

  get isBrowserPlatform(): boolean {
    if (this.platform.is('capacitor')) {
      return false;
    }
    return true;

  }

  submit() {
    /**
    this.errorsMessage = [];

    if (this.clienteForm.get('nome').hasError('required')) {
      this.errorsMessage.push('Nome é obrigatório');
    }
    if (this.clienteForm.get('email').hasError('required')) {
      this.errorsMessage.push('Email é obrigatório');
    }

    this.hasErrors = this.errorsMessage.length > 0; //*/

  }

}
