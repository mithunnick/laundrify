import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  // ===============================
  // ORDER STAGES
  // ===============================

  stages = [
    'Pickup Scheduled',
    'Pickup Completed',
    'In Process',
    'Back From Wash',
    'Out For Delivery',
    'Delivered'
  ];

  // ===============================
  // SERVICES (KG BASED)
  // ===============================

  services = [
    { name: 'Wash & Fold', pricePerKg: 70 },
    { name: 'Wash & Iron', pricePerKg: 90 },
    { name: 'Iron Only', pricePerKg: 40 },
    { name: 'Fold Only', pricePerKg: 30 }
  ];

  // ===============================
  // GARMENT LIST (NO PRICING)
  // ===============================

  pieceItems = [

    { name: 'Shirt' },
    { name: 'T-Shirt' },
    { name: 'Top' },

    { name: 'Trouser' },
    { name: 'Jeans' },

    { name: 'Kurta' },

    { name: 'Pyjama' },
    { name: 'Salwar' },
    { name: 'Petticoat' },

    { name: 'Coat' },
    { name: 'Jacket' },

    { name: 'Sherwani' },

    { name: 'Tie' },

    { name: 'Overcoat' },

    { name: 'Cotton Saree' },
    { name: 'Silk Saree' },

    { name: 'Blouse' },
    { name: 'Dupatta' },
    { name: 'Scarf' },

    { name: 'Dress' },
    { name: 'Gown' },

    { name: 'Long Skirt' },

    { name: 'Sweater' },
    { name: 'Shawl' },

    { name: 'Baby Shirt' },
    { name: 'Baby Trouser' },
    { name: 'Baby Frock' },

    { name: 'Bed Sheet Single' },
    { name: 'Bed Sheet Double' },

    { name: 'Hand Towel' },
    { name: 'Bath Towel' },

    { name: 'Cushion Cover' },
    { name: 'Pillow Cover' },

    { name: 'Blanket Single' },
    { name: 'Blanket Double' },
    { name: 'Blanket King Size' }
  ];

  // ===============================
  // ORDER STORAGE
  // ===============================

  activeOrders: any[] = [];
  orderHistory: any[] = [];

  constructor() {
    this.seedDemoData();
  }

  // ===============================
  // DEMO DATA
  // ===============================

  private seedDemoData() {

    let id = 1001;

    for (let i = 0; i < 10; i++) {
      this.activeOrders.push(
        this.createRandomOrder(id++, false)
      );
    }

    for (let i = 0; i < 12; i++) {
      this.orderHistory.push(
        this.createRandomOrder(id++, true)
      );
    }
  }

  private createRandomOrder(id: number, isHistory: boolean) {

    const randomService =
      this.services[Math.floor(Math.random() * this.services.length)];

    const weight = Math.floor(Math.random() * 8) + 2;
    const totalAmount = weight * randomService.pricePerKg;

    const paidAmount = isHistory
      ? Math.floor(Math.random() * totalAmount)
      : Math.floor(Math.random() * (totalAmount / 2));

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
      serviceType: randomService.name,
      weight,
      garments: [],
      pricePerKg: randomService.pricePerKg,
      totalAmount,
      paidAmount,
      pendingAmount,
      paymentMode,
      paymentStatus,
      currentStageIndex: isHistory
        ? this.stages.length - 1
        : Math.floor(Math.random() * (this.stages.length - 1)),
      pickupDate: new Date().toISOString()
    };
  }

  // ===============================
  // CREATE NEW ORDER (WITH GARMENTS)
  // ===============================

  createNewOrder(
    serviceType: string,
    weight: number,
    garments: { name: string; quantity: number }[]
  ) {

    const service = this.services.find(s => s.name === serviceType);
    if (!service) return;

    const totalAmount = weight * service.pricePerKg;

    const newOrder = {
      id: Date.now(),
      serviceType,
      weight,
      garments,
      pricePerKg: service.pricePerKg,
      totalAmount,
      paidAmount: 0,
      pendingAmount: totalAmount,
      paymentMode: 'Not Paid',
      paymentStatus: 'Unpaid',
      currentStageIndex: 0,
      pickupDate: new Date().toISOString()
    };

    this.activeOrders.unshift(newOrder);
  }

  // ===============================
  // GETTERS
  // ===============================

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