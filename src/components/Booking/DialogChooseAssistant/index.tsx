import IconSelectEmployee from "@/components/common/IconSelectEmployee";
import { Modal } from "flowbite-react";
import React, { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
// import IconSelectEmployee from "../common/IconSelectEmployee";
import { boolean } from "yup";

interface DialogSpecialAssistantProps {
  openModal: boolean;
  handleClose: () => void;
  handleSelect: (select: string) => void;
}

const DialogChooseAssistant = ({
  openModal,
  handleClose,
  handleSelect,
}: DialogSpecialAssistantProps) => {
  return (
    <>
      <Modal show={openModal} size="lg" onClose={handleClose} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <IconSelectEmployee />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Do you want to change to another worker?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={() => handleSelect("no")}
                className="bg-primary text-white  py-2 px-4 rounded-lg flex items-center gap-2 disabled:bg-gray-4"
              >
                No
              </button>
              <button
                type="button"
                onClick={() => handleSelect("yes")}
                className="bg-transparent text-black py-2 border border-stroke px-4 rounded-lg flex items-center gap-2 disabled:bg-gray-4"
              >
                Yes
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DialogChooseAssistant;
