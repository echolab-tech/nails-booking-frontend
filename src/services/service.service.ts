import React, { useState, useEffect } from "react";

import { http } from "../lib/http";
import { ServicePackageType } from "@/types/service";

export const getListService = async (
  page: number,
  search: any | null,
): Promise<any> => {
  return await http.get<any>(
    `/services?search=${search ? search : ""}&page=${page}`,
  );
};

export const addService = async (values: any): Promise<any> => {
  return await http.post<any>("/services", values);
};
export const getService = async (id: string): Promise<any> => {
  return await http.get<any>(`/services/${id}`);
};
export const updateService = async (id: string, data: any): Promise<any> => {
  return await http.put<any>(`/services/${id}`, data);
};
export const deleteService = async (id: number | null): Promise<any> => {
  return await http.delete<any>(`/services/${id}`);
};

export const addServicePackage = async (
  values: ServicePackageType,
): Promise<any> => {
  return await http.post<any>("/combos", values);
};
