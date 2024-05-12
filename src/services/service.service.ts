import React, { useState, useEffect } from 'react';

import { http } from "../lib/http";

export const getListService = async (page: number, search: any | null): Promise<any> => {

  return await http.get<any>(`/services?search=${search ? search: ""}&page=${page}`);
};
