import React, { useState, useEffect } from 'react';

import { http } from "../lib/http";

export const getListService = async (): Promise<any> => {

  return await http.get<any>("/services");
};
