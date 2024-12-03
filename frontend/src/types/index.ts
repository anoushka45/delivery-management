export interface Metrics {
  totalOrders: number;
  pendingOrders: number;
  assignedOrders: number;
  deliveredOrders: number;
  activePartners: number;
  availablePartners: number;
  busyPartners: number;
}

export interface Assignment {
  orderId: string;
  partnerId: string;
  status: string;
}

export interface Shift {
  start: string;
  end: string;
}

export interface MetricsInfo {
  rating: number;
  completedOrders: number;
  cancelledOrders: number;
}

export interface Partner {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive"; // Enum type for status
  currentLoad: number; // Number of active orders assigned
  areas: string[]; // Array of delivery areas
  shift: Shift; // Object with start and end times
  metrics: MetricsInfo; // Performance metrics
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  area: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  status: "pending" | "assigned" | "picked" | "delivered";
  scheduledFor: string;
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Assignment2 {
    _id: string;
    orderId: {
      _id: string;
      orderNumber: string;
    };
    partnerId: {
      _id: string;
      name: string;
      email: string;
      phone: string;
    };
    timestamp: string;
    status: 'success' | 'failed';
    reason?: string;
  }

export interface Metrics2 {
    totalAssigned: number;
    successRate: number;
    averageTime: number;
    failureReasons: { reason: string; count: number }[];
}

export interface PartnerOverview {
  available: number;
  busy: number;
  offline: number;
}
