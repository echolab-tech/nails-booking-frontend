import React from "react";

interface PaymentButtonProps {
  isActive: boolean;
  icon: any;
  method: string;
  onClick: () => void;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  method,
  icon,
  isActive,
  onClick,
}) => {
  return (
    <button
      className={`border-1 flex h-[120px] w-full flex-col items-center justify-center gap-2 rounded-md text-black ${
        isActive ? "border-blue2 border" : "border border-stroke"
      }`}
      onClick={onClick}
    >
      {icon}
      <span className="block text-2xl font-medium">
        {method.charAt(0).toUpperCase() + method.slice(1)}
      </span>
    </button>
  );
};

export default PaymentButton;
