import React, { useState, useEffect } from 'react';

import { http } from "../lib/http";
import { CustomerForm } from '@/types/customerForm';

export const customers = async (values: CustomerForm): Promise<any> => {
  return await http.post<any>("/customers", values);
};

export const getSearchCustomer = async (page: number, search: any | null): Promise<any> => {
  return await http.get<any>(`/customers?search=${search ? search: ""}&page=${page}`);
};

export const getCustomerDetail = async (id: BigInt): Promise<any> => {
  return await http.get<any>(`/customers/${id}`);
};

export const deleteCustomer = async (id: BigInt): Promise<any> => {
  return await http.delete<any>(`/customers/${id}`);
};