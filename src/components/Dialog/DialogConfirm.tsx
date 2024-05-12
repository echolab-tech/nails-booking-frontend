"use client";

import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

interface DialogConfirm {
  message: string;
  onClose: () => void;
  children?: JSX.Element | JSX.Element[];
  openModal: boolean;
}

export function DialogConfirm({
  openModal,
  message,
  onClose,
  children,
}: DialogConfirm) {
  return (
    <>
      <Modal
        show={openModal}
        size="md"
        onClose={() => onClose()}
        popup
        className=""
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="text-gray-400 dark:text-gray-200 mx-auto mb-4 h-14 w-14" />
            <h3 className="text-gray-500 dark:text-gray-400 mb-5 text-lg font-normal">
              {message}
            </h3>
            <div className="flex justify-center gap-4">{children}</div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
