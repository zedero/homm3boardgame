import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BattleAiComponent } from './battle-ai.component';

describe('BattleAiComponent', () => {
  let component: BattleAiComponent;
  let fixture: ComponentFixture<BattleAiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BattleAiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BattleAiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
