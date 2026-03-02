import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  stages = [
    'Pickup Scheduled',
    'Pickup Completed',
    'In Process',
    'Back From Wash',
    'Out For Delivery',
    'Delivered'
  ];

  activeOrders: any[] = [];
  orderHistory: any[] = [];

  constructor() {
    this.seedDemoData();
  }

  private seedDemoData() {

    const createOrder = (
      id: number,
      serviceType: string,
      weight: number,
      pricePerKg: number,
      deliveryCharge: number,
      paidAmount: number,
      stageIndex: number
    ) => {

      const totalAmount = weight * pricePerKg + deliveryCharge;
      const pendingAmount = Math.max(totalAmount - paidAmount, 0);

      let paymentStatus = 'Unpaid';
      if (paidAmount === 0) paymentStatus = 'Unpaid';
      else if (pendingAmount === 0) paymentStatus = 'Paid';
      else paymentStatus = 'Partial';

      const modes = ['Online', 'UPI', 'Cash', 'Cheque'];
      const paymentMode =
        paidAmount > 0
          ? modes[Math.floor(Math.random() * modes.length)]
          : 'Not Paid';

      return {
        id,
        serviceType,
        weight,
        pricePerKg,
        deliveryCharge,
        totalAmount,
        paidAmount,
        pendingAmount,
        paymentMode,
        paymentStatus,
        currentStageIndex: stageIndex,
        pickupDate: new Date().toISOString()
      };
    };

    const prices: any = {
      'Wash & Fold': 70,
      'Wash & Iron': 90,
      'Iron Only': 40,
      'Fold Only': 30
    };

    let id = 1001;

    for (let i = 0; i < 10; i++) {
      this.activeOrders.push(
        createOrder(
          id++,
          Object.keys(prices)[i % 4],
          Math.floor(Math.random() * 8) + 2,
          Object.values(prices)[i % 4] as number,
          30,
          Math.floor(Math.random() * 400),
          Math.floor(Math.random() * 5)
        )
      );
    }

    for (let i = 0; i < 12; i++) {
      this.orderHistory.push(
        createOrder(
          id++,
          Object.keys(prices)[i % 4],
          Math.floor(Math.random() * 8) + 2,
          Object.values(prices)[i % 4] as number,
          30,
          Math.floor(Math.random() * 800) + 200,
          5
        )
      );
    }
  }

  getActiveOrders() {
    return this.activeOrders;
  }

  getOrderHistory() {
    return this.orderHistory;
  }

  getOrderById(id: number) {
    return this.activeOrders.find(o => o.id === id) ||
           this.orderHistory.find(o => o.id === id);
  }
}