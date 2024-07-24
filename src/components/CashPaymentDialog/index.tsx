import { Modal } from "flowbite-react";
import React, { useState, useEffect, ChangeEvent } from "react";
import { FiDelete } from "react-icons/fi";
import { number } from "yup";

interface CashPaymentDialogProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (amount: number) => void;
  initialAmount: number;
  // Add initialAmount prop
}

const CashPaymentDialog: React.FC<CashPaymentDialogProps> = ({
  isVisible,
  onClose,
  onSave,
  initialAmount, // Destructure initialAmount prop
}) => {
  const [amount, setAmount] = useState<string>("");

  useEffect(() => {
    if (isVisible) {
      setAmount(initialAmount.toString());
    }
  }, [isVisible, initialAmount]);

  const handleButtonClick = (value: string) => {
    setAmount((prevAmount) => prevAmount + value);
  };

  const handleDelete = () => {
    setAmount((prevAmount) => prevAmount.slice(0, -1));
  };

  const handleSave = () => {
    const numericAmount = parseFloat(amount);
    if (!isNaN(numericAmount)) {
      onSave(numericAmount);
    }
  };

  const handleOnchange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  return (
    <Modal size="md" show={isVisible} onClose={onClose}>
      <Modal.Header className="border-0">Add cash amount</Modal.Header>
      <Modal.Body>
        <input
          type="text"
          value={amount}
          onChange={handleOnchange}
          className="mb-2 w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-xl font-bold text-black outline-none transition disabled:cursor-default dark:text-white dark:focus:border-primary"
        />
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, ".", 0].map((value) => (
            <button
              key={value}
              onClick={() => handleButtonClick(value.toString())}
              className="rounded-md border border-gray p-4 text-xl font-bold text-black hover:bg-slate-200"
            >
              {value}
            </button>
          ))}
          <button
            onClick={handleDelete}
            className="rounded-md border border-gray p-4 text-xl font-bold text-black hover:bg-slate-200"
          >
            <FiDelete />
          </button>
        </div>
      </Modal.Body>
      <Modal.Footer className="justify-between border-0">
        <h2 className="text-xl font-bold text-black">
          Left to pay・ {initialAmount - Number(amount)}
        </h2>
        <button
          onClick={handleSave}
          className="mr-2 w-[100px] rounded-md bg-black p-2 text-white"
        >
          OK
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default CashPaymentDialog;
