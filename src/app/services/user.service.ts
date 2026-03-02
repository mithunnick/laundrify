import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user = {
    name: 'Rahul Sharma',
    phone: '9876543210',
    email: 'rahul@email.com',
    address: 'Flat 402, Green Heights, Andheri East, Mumbai'
  };

  getUser() {
    return this.user;
  }
}