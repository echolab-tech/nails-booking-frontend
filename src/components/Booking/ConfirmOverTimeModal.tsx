import { Modal } from "flowbite-react";

interface ConfirmOverTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmOverTimeModal = ({
  isOpen,
  onClose,
  onConfirm,
}: ConfirmOverTimeModalProps) => {
  return (
    <Modal show={isOpen} onClose={onClose}>
      <Modal.Header>Warning completion time</Modal.Header>
      <Modal.Body>
        <p>Completion time will be past 8 PM, do you want to do it?</p>
      </Modal.Body>
      <Modal.Footer>
        <button
          onClick={onConfirm}
          className="rounded-lg bg-primary px-4 py-2 text-white"
        >
          Yes, you will do it
        </button>
        <button
          onClick={onClose}
          className="rounded-lg border px-4 py-2"
        >
          No, reconsider.
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmOverTimeModal;
