import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreatureBankComponent } from './creature-bank.component';

describe('BlockedHexComponent', () => {
  let component: CreatureBankComponent;
  let fixture: ComponentFixture<CreatureBankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatureBankComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreatureBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
