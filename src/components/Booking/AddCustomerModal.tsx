import { Modal } from "flowbite-react";

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (addMore: boolean) => void;
}

const AddCustomerModal = ({
  isOpen,
  onClose,
  onConfirm,
}: AddCustomerModalProps) => {
  return (
    <Modal show={isOpen} onClose={onClose}>
      <Modal.Header>Add More Customers</Modal.Header>
      <Modal.Body>
        <p>
          Add more customer to the group who come altogether at the same time?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <button
          onClick={() => onConfirm(true)}
          className="rounded-lg bg-primary px-4 py-2 text-white"
        >
          Yes, add more customers
        </button>
        <button
          onClick={() => onConfirm(false)}
          className="rounded-lg border px-4 py-2"
        >
          No, continue
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddCustomerModal;
