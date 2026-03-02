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
  // GARMENT LIST
  // ===============================

  pieceItems = [
    { name: 'Shirt' }, { name: 'T-Shirt' }, { name: 'Top' },
    { name: 'Trouser' }, { name: 'Jeans' },
    { name: 'Kurta' },
    { name: 'Pyjama' }, { name: 'Salwar' }, { name: 'Petticoat' },
    { name: 'Coat' }, { name: 'Jacket' },
    { name: 'Sherwani' }, { name: 'Tie' }, { name: 'Overcoat' },
    { name: 'Cotton Saree' }, { name: 'Silk Saree' },
    { name: 'Blouse' }, { name: 'Dupatta' }, { name: 'Scarf' },
    { name: 'Dress' }, { name: 'Gown' }, { name: 'Long Skirt' },
    { name: 'Sweater' }, { name: 'Shawl' },
    { name: 'Baby Shirt' }, { name: 'Baby Trouser' }, { name: 'Baby Frock' },
    { name: 'Bed Sheet Single' }, { name: 'Bed Sheet Double' },
    { name: 'Hand Towel' }, { name: 'Bath Towel' },
    { name: 'Cushion Cover' }, { name: 'Pillow Cover' },
    { name: 'Blanket Single' }, { name: 'Blanket Double' }, { name: 'Blanket King Size' }
  ];

  // ===============================
  // STORAGE
  // ===============================

  activeOrders: any[] = [];
  orderHistory: any[] = [];

  constructor() {
    this.seedDemoData();
  }

  // ===============================
  // STAGE HISTORY INITIALIZER
  // ===============================

  private initializeStageHistory(currentStageIndex: number) {
    return this.stages.map((stage, index) => ({
      stage,
      date: index <= currentStageIndex
        ? this.generatePastDate(index)
        : null
    }));
  }

  private generatePastDate(offset: number) {
    const date = new Date();
    date.setDate(date.getDate() - (this.stages.length - offset));
    return date.toISOString();
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
      ? totalAmount
      : Math.floor(Math.random() * (totalAmount / 2));

    const pendingAmount = totalAmount - paidAmount;

    let paymentStatus = 'Unpaid';
    if (paidAmount === 0) paymentStatus = 'Unpaid';
    else if (pendingAmount === 0) paymentStatus = 'Paid';
    else paymentStatus = 'Partial';

    const currentStageIndex = isHistory
      ? this.stages.length - 1
      : Math.floor(Math.random() * (this.stages.length - 1));

    return {
      id,
      serviceType: randomService.name,
      weight,
      garments: [],
      pricePerKg: randomService.pricePerKg,
      totalAmount,
      paidAmount,
      pendingAmount,
      paymentMode: paidAmount > 0 ? 'Online' : 'Not Paid',
      paymentStatus,
      currentStageIndex,
      stageHistory: this.initializeStageHistory(currentStageIndex),
      pickupDate: new Date().toISOString()
    };
  }

  // ===============================
  // CREATE NEW ORDER
  // ===============================

  createNewOrder(
    serviceType: string,
    weight: number,
    garments: { name: string; quantity: number }[]
  ) {

    const service = this.services.find(s => s.name === serviceType);
    if (!service) return;

    const totalAmount = weight * service.pricePerKg;

    const currentStageIndex = 0;

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
      currentStageIndex,
      stageHistory: this.stages.map((stage, index) => ({
        stage,
        date: index === 0 ? new Date().toISOString() : null
      })),
      pickupDate: new Date().toISOString()
    };

    this.activeOrders.unshift(newOrder);
  }

  // ===============================
  // ADVANCE STAGE
  // ===============================

  advanceStage(orderId: number) {

    const order = this.getOrderById(orderId);
    if (!order) return;

    if (order.currentStageIndex >= this.stages.length - 1) return;

    order.currentStageIndex++;

    order.stageHistory[order.currentStageIndex].date =
      new Date().toISOString();

    // If delivered → move to history
    if (order.currentStageIndex === this.stages.length - 1) {
      this.activeOrders = this.activeOrders.filter(o => o.id !== orderId);
      this.orderHistory.unshift(order);
    }
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