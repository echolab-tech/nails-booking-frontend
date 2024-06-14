import React, { useState, useEffect } from 'react';

import { http } from "../lib/http";
import { serviceType } from '@/types/Service';

export const getListService = async (page: number, search: any | null): Promise<any> => {

  return await http.get<any>(`/services?search=${search ? search: ""}&page=${page}`);
  
};

export const service = async (values: serviceType): Promise<any> => {
  return await http.post<any>("/services", values);
};
