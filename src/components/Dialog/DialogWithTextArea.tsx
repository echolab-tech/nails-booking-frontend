"use client";

import { Modal } from "flowbite-react";

interface DialogWithTextArea {
  onClose: () => void;
  children?: JSX.Element | JSX.Element[];
  openModal: boolean;
  description: string;
  setDescription: (value: string) => void;
}

export function DialogWithTextArea({
  openModal,
  onClose,
  children,
  setDescription,
  description
}: DialogWithTextArea) {
  return (
    <>
      <Modal
        show={openModal}
        size="xl"
        onClose={() => onClose()}
        popup
        className=""
      >
        <Modal.Header>
          <h2 className="text-lg font-semibold text-gray-700">Description</h2>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full min-h-[200px] p-3 border rounded text-sm mb-3" name="" id=""></textarea>
            <div className="flex justify-center gap-4">
              {children}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
