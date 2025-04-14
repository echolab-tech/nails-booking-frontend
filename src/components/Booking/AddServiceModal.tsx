import { Modal } from "flowbite-react";

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (addMore: boolean) => void;
}

const AddServiceModal = ({
  isOpen,
  onClose,
  onConfirm,
}: AddServiceModalProps) => {
  return (
    <Modal show={isOpen} onClose={onClose}>
      <Modal.Header>Add More Services</Modal.Header>
      <Modal.Body>
        <p>Would you like to add more services for this customer?</p>
      </Modal.Body>
      <Modal.Footer>
        <button
          onClick={() => onConfirm(true)}
          className="rounded-lg bg-primary px-4 py-2 text-white"
        >
          Yes, add another service
        </button>
        <button
          onClick={() => onConfirm(false)}
          className="rounded-lg border px-4 py-2"
        >
          No, continue to next customer
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddServiceModal;
