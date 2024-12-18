import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawerComponent } from './drawer.component';
import {
  ButtonModule,
  ConfirmationService,
  ConfirmDialogModule,
  MessageService,
  SharedModule,
  SidebarModule,
  TableModule,
} from 'primeng';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OktaAuthModule, OktaAuthService } from '@okta/okta-angular';
import { EnvServiceFactory } from '../../service/env.service.provider';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../../service/general.service';
import { Drawer } from '../../models/drawer';

describe('DrawerComponent', () => {
  let component: DrawerComponent;
  let fixture: ComponentFixture<DrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        TableModule,
        ButtonModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        SidebarModule,
        HttpClientTestingModule,
        ConfirmDialogModule,
        OktaAuthModule.initAuth(EnvServiceFactory().getAuth()),
      ],
      declarations: [DrawerComponent],
      providers: [
        HttpClient,
        MessageService,
        GeneralService,
        OktaAuthService,
        ConfirmationService,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawerComponent);
    component = fixture.componentInstance;
    component.drawer = new Drawer();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  afterEach(() => {
    fixture.destroy();
  });
});
