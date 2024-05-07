"use client";
import React, { useState, ReactElement } from "react";

// Define the shape of the context data
interface ToastContextType {
  isOpen: boolean;
  toggleTheme: (data: boolean) => void;
}

// Create the context with a default value
export const ToastContext = React.createContext<ToastContextType>({
  isOpen: false,
  toggleTheme: (data: boolean) => {},
});

// Create a provider component
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleTheme = (data: boolean) => {
    setIsOpen(data);
  };

  return (
    <ToastContext.Provider value={{ isOpen, toggleTheme }}>
      {children}
    </ToastContext.Provider>
  );
};
