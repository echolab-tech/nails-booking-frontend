import React, { useState, useEffect } from "react";

import { http } from "../lib/http";


export const getRecentsales = async (isRecentSales: boolean): Promise<any> => {
  return await http.get<any>(`/dashboard/chats?isRecentSales=${isRecentSales}`);
};