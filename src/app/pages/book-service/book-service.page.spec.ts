import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookServicePage } from './book-service.page';

describe('BookServicePage', () => {
  let component: BookServicePage;
  let fixture: ComponentFixture<BookServicePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BookServicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
