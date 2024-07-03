"use client";

import React, { useState } from "react";

export const useModal = () => {
  const [visibleId, setVisible] = useState<string | null>(null);
  const toggle = (id: string) => {
    setVisible((prevId) => (prevId === id ? null : id));
  };
  return { toggle, visibleId };
};
