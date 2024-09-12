import React, { useState, useEffect } from "react";

import { http } from "../lib/http";

export const getListSubService = async (
  page: number,
  search: any | null,
): Promise<any> => {
  return await http.get<any>(
    `/sub-services?search=${search ? search : ""}&page=${page}`,
  );
};

export const addSubService = async (values: any): Promise<any> => {
  return await http.post<any>("/sub-services", values);
};
export const getSubService = async (id: string): Promise<any> => {
  return await http.get<any>(`/sub-services/${id}`);
};
export const updateSubService = async (id: string, data: any): Promise<any> => {
  return await http.put<any>(`/sub-services/${id}`, data);
};
export const deleteSubService = async (id: string | null): Promise<any> => {
  return await http.delete<any>(`/sub-services/${id}`);
};
