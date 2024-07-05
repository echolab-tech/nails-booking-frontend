import React, { useState, useEffect } from "react";

import { http } from "../lib/http";

export const getRecentsales = async (isRecentSales: boolean): Promise<any> => {
  return await http.get<any>(`/dashboard/chats?isRecentSales=${isRecentSales}`);
};

export const getTopServices = async (page: number): Promise<any> => {
  return await http.get<any>(`/dashboard/top-service`);
};

export const getTopAssistants = async (): Promise<any> => {
  return await http.get<any>(`/dashboard/top-assistants`);
};
