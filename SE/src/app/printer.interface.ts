export interface Printer {
    id: number;
    name: string;
    isActive: boolean;
    brand: string;
    model: string;
    description: string;
    location: string;
  }
  
  export interface PrinterResponse {
    activePrinters: Printer[];
    inactivePrinters: Printer[];
  }