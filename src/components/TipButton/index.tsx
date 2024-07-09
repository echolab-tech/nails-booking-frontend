import React from "react";

interface TipButtonProps {
  label: string;
  isActive: boolean;
  amount?: number;
  onClick: () => void;
}

const TipButton: React.FC<TipButtonProps> = ({
  label,
  amount,
  isActive,
  onClick,
}) => {
  return (
    <button
      className={`border-1 h-[120px] w-full rounded-md text-black ${
        isActive ? "border-blue2 border" : "border border-stroke"
      }`}
      onClick={onClick}
    >
      <span className="block text-2xl font-medium">{label}</span>
      {amount !== undefined && (
        <span className="text-dark mt-2 block">${amount.toFixed(2)}</span>
      )}
    </button>
  );
};

export default TipButton;
