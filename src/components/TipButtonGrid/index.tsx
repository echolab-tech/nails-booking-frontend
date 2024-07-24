import React, { useState } from "react";
import TipButton from "../TipButton";

interface TipButtonGridProps {
  onChange: (value: number | undefined, label: string) => void;
  value: string;
  totalAmount: number;
}
const TipButtonGrid: React.FC<TipButtonGridProps> = ({
  onChange,
  value,
  totalAmount,
}) => {
  const [activeButton, setActiveButton] = useState<string | null>(value);

  const handleButtonClick = (label: string) => {
    setActiveButton(label);
    onChange(calculateTip(label), label);
  };

  const calculateTip = (label: string): number | undefined => {
    if (label === "No Tips") {
      return undefined;
    }
    if (label === "Custom") {
      return 0;
    }
    const percentage = parseInt(label);
    return (totalAmount * percentage) / 100;
  };

  const tipLabels = ["No Tips", "10%", "18%", "25%", "35%", "45%", "Custom"];

  return (
    <div className="grid grid-cols-3 gap-4">
      {tipLabels.map((label) => (
        <TipButton
          key={label}
          label={label}
          amount={calculateTip(label)}
          isActive={activeButton === label}
          onClick={() => handleButtonClick(label)}
        />
      ))}
    </div>
  );
};

export default TipButtonGrid;
