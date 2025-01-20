export interface LoginResponse {
  user: User;
  tokens: Tokens;
}

export interface User {
  id: string;
  email: string;
  firstname: string;
  middlename: string;
  lastname: string;
  role: string;
  gender: string;
  dob: string;
  phone: string;
  username: string;
  userType: string;
  deleted: boolean;
  active: boolean;
  emailVerified: boolean;
}

export interface Tokens {
  access: Token;
  refresh: Token;
}

export interface Token {
  token: string;
  expires: string;
}

export interface RiceMill {
  id: string;
  name: string;
  phone: string;
  contactPerson: string;
  location: string;
  gst: string;
}

export interface DhalariDetails {
  id: string;
  name: string;
  rythuName: string;
  location: string;
}

export interface KiraiDetails {
  loadingDate: string;
  reachedDate: string;
  mediator: {
    name: string;
    number: string;
  };
  notes: string;
  instructions: string;
  riceMill: RiceMill;
  loadingDetails: {
    perBag: number;
    deliveryType: string;
    riceType: string;
    bagCount: number;
    waymentType: string;
    loadingRate: number;
    commission: number;
    totalRate: number;
  };
  dhalariDetails: DhalariDetails;
  lorryDetails: {
    driverName: string;
    driverLocation: string;
    ownerName: string;
    ownerLocation: string;
    lorryNumber: string;
    driverNumber: string;
  };
  transportOffices: {
    name: string;
    phoneNumber: string;
  };
  kiraiDetails: {
    type: string;
    perTon: number;
    advance: number;
    balance: string;
    driverAllowances: number;
  };
  weightageDetails: {
    id: string;
    billNumber: string;
    type: string;
    total: number;
    empty: number;
    itemWeight: number;
  };
  klno: string;
}