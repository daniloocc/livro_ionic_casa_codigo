import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Peca } from 'src/app/models/peca.model';
import { ToastService } from 'src/app/services/toast.service';
import { Guid } from 'guid-typescript';
import { PecasService } from 'src/app/services/pecas.service';

@Component({
  selector: 'app-pecas-add-edit',
  templateUrl: './pecas-add-edit.page.html',
  styleUrls: ['./pecas-add-edit.page.scss'],
})
export class PecasAddEditPage implements OnInit {

  private peca: Peca;
  public modoDeEdicao = false;
  public pecasForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private pecasService: PecasService,
    private router: Router
  ) { }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id && Guid.isGuid(id)) {
      // recuperamos o objeto persistido
      this.peca = await this.pecasService.getById(id);
    } else {
      this.peca = { id: Guid.createEmpty(), nome: '', valor: 0.00 }
      this.modoDeEdicao = true;
    }

    this.pecasForm = this.formBuilder.group({
      id: [this.peca.id],
      nome: [this.peca.nome, Validators.required],
      valor: [this.peca.valor, Validators.required]
    });
  }

  iniciarEdicao() {
    this.modoDeEdicao = true;
  }

  cancelarEdicao() {
    this.pecasForm.setValue(this.peca);
    this.modoDeEdicao = false;
  }

  async submit() {
    //atualizar/inserir objeto de maneira persistida
    await this.pecasService.update(this.pecasForm.value);
    console.log(this.pecasForm.value);
    this.peca = this.pecasForm.value;

    this.toastService.presentToast('Gravação Bem Sucedida', 3000, 'top');
    this.modoDeEdicao = false;

    //navegar para a pagina principal
    this.router.navigateByUrl('');
  }

}
