export type Booking = {
  id: string;
  purpose: string;
  destination: string;
  user: {
    name: string;
    department: string;
  };
  dates: {
    start: Date;
    end: Date;
  };
  vehicle?: string;
  driver?: string;
  status: 'Pending Admin' | 'Pending Inspector' | 'Approved' | 'Rejected' | 'In Progress' | 'Completed';
}

export type Vehicle = {
    id: string;
    name: string;
    category: 'Sedan' | 'SUV' | 'Minibus' | 'Bus';
    registration: string;
    status: 'Available' | 'In Use' | 'Maintenance';
    imageUrl: string;
}
