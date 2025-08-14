import { Modal } from "flowbite-react";
import React, { useState } from "react";

interface TechnicianUnavailableModalProps {
  openModal: boolean;
  handleClose: () => void;
  handleWaitingList: () => void;
  handleFindNewTime: () => void;
  handleChangeTechnician: () => void;
  handleCancelBooking: () => void;
}

const TechnicianUnavailableModal = ({
  openModal,
  handleClose,
  handleWaitingList,
  handleFindNewTime,
  handleChangeTechnician,
  handleCancelBooking,
}: TechnicianUnavailableModalProps) => {
  return (
    <>
      <Modal show={openModal} size="lg" onClose={handleClose} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="text-gray-500 mb-5 text-lg font-normal dark:text-gray-400">
              Sorry, we do not have enough available technician(s) to do the
              service(s) at the time you requested. Please choose one of the
              following options below:
            </h3>
            <div className="flex flex-col justify-center gap-4">
              <button
                type="button"
                onClick={handleWaitingList}
                className="flex w-full items-center gap-2 rounded-lg border border-black px-4 py-2  text-black disabled:bg-gray-4"
              >
                Sign up on the waiting list
              </button>
              <button
                type="button"
                onClick={handleFindNewTime}
                className="flex w-full items-center gap-2 rounded-lg border border-black bg-transparent px-4 py-2 text-black disabled:bg-gray-4"
              >
                Find a new time
              </button>
              <button
                type="button"
                onClick={handleChangeTechnician}
                className="flex w-full items-center gap-2 rounded-lg border border-black bg-transparent px-4 py-2 text-black disabled:bg-gray-4"
              >
                Return to choose the alternative technician
              </button>
              <button
                type="button"
                onClick={handleCancelBooking}
                className="flex w-full items-center gap-2 rounded-lg border border-red bg-transparent px-4 py-2 text-red disabled:bg-gray-4"
              >
                Cancel this booking
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default TechnicianUnavailableModal;
