import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrdensDeServicoAddEditPage } from './ordensdeservico-add-edit.page';

describe('OrdensdeservicoAddEditPage', () => {
  let component: OrdensDeServicoAddEditPage;
  let fixture: ComponentFixture<OrdensDeServicoAddEditPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OrdensDeServicoAddEditPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrdensDeServicoAddEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
