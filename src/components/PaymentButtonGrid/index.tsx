import React, { useEffect, useState } from "react";
import { BsCashCoin } from "react-icons/bs";
import { GoGift } from "react-icons/go";
import { LuSplitSquareHorizontal } from "react-icons/lu";
import { RiMastercardFill } from "react-icons/ri";

import PaymentButton from "../PaymentButton";

interface PaymentButtonGridProps {
  onChange: (label: string) => void;
  value: string;
}
const PaymentButtonGrid: React.FC<PaymentButtonGridProps> = ({
  onChange,
  value,
}) => {
  const [activeButton, setActiveButton] = useState<string | null>(value);
  useEffect(() => {
    setActiveButton(value);
  }, [value]);

  const handleButtonClick = (method: string) => {
    setActiveButton(method);
    onChange(method);
  };

  const paymentMethods = [
    { method: "cash", icon: <BsCashCoin size={24} /> },
    { method: "giftcard", icon: <GoGift size={24} /> },
    { method: "splitpayment", icon: <LuSplitSquareHorizontal size={24} /> },
    { method: "mastercard", icon: <RiMastercardFill size={24} /> },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {paymentMethods.map(({ method, icon }) => (
        <PaymentButton
          key={method}
          method={method}
          icon={icon}
          isActive={activeButton === method}
          onClick={() => handleButtonClick(method)}
        />
      ))}
    </div>
  );
};

export default PaymentButtonGrid;
