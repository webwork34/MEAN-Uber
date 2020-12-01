export interface User {
  email: string;
  password: string;
}

export interface ChangePassword {
  oldPassword: string;
  newPassword: string;
}

export interface Load {
  name: string;
  pickup_address: string;
  delivery_address: string;
  payload: number;
  dimensions: {
    width: number;
    length: number;
    height: number;
  };
  _id?: string;
  created_date?: string;
  status?: string;
  created_by?: string;
  assigned_to?: string;
  state?: string;
}

export interface Truck {
  type: string;
  _id?: string;
  created_by?: string;
  assigned_to?: string;
  created_date?: string;
  status?: string;
}
