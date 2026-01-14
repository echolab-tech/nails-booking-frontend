"use client";
import { useEffect } from "react";
import Stepper from "../../../../components/Booking/Stepper";
import StepAddSubService from "../../../../components/Booking/StepAddSubService";
import ConfirmBooking from "../../../../components/Booking/ConfirmBooking";
import DialogSpecialAssistant from "../../../../components/DialogSpecialAssistant";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import StepAddSummaryService from "../../../../components/Booking/StepAddSummaryService";
import StepAddCategory from "../../../../components/Booking/StepAddCategory";
import StepAddService from "../../../../components/Booking/StepAddService";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SelectEmployee from "@/components/Booking/SelectEmployee";
import { useAppointment } from "@/contexts/AppointmentContext";
import AddServiceModal from "@/components/Booking/AddServiceModal";
import { toast } from "react-toastify";
import { getAppointmentById } from "@/services/appointment.service";
import AddCustomerModal from "@/components/Booking/AddCustomerModal";
import StepUpdateStarttime from "@/components/Booking/StepUpdateStarttime";
import { DialogConfirm } from "@/components/Dialog/DialogConfirm";

const BookingPage = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const router = useRouter();
  const { state, dispatch } = useAppointment();
  const [appointmentData, setAppointmentData] = useState<any | null>(null);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [bookingType, setBookingType] = useState<number>(0);
  const [openModalConfirm, setOpenModalConfirm] = useState(false);

  useEffect(() => {
    dispatch({ type: "RESET_APPOINTMENT" });
    dispatch({ type: "SET_STEP", payload: 1 });
    getAppointmentData();
  }, []);

  useEffect(() => {
    if (!state.selectedTime) {
      router.push("/");
    }
  }, [state.selectedTime, router]);

  const isEdit = true;
  const getAppointmentData = async() => {
    if (!state.appointmentId) return;
    const data = await getAppointmentById(state.appointmentId);
    setBookingType(data?.data?.data?.booking_type);
    setAppointmentData(data?.data?.data);
  }

  const handleNext = () => {
    if (state.currentStep === 5) {
      if (bookingType === 0) {
        dispatch({ type: "SET_ASSISTANT", payload: null });
        setShowAddServiceModal(true);
      } else {
        setOpenModal(true);
      }
    } else if (state.currentStep === 6) {
      setShowAddServiceModal(true);
    } else if (state.currentStep === 7) {
      toast("Booking successfuly !");
      router.push("/calendar");
    } else {
      dispatch({ type: "SET_STEP", payload: state.currentStep + 1 });
    }
  };

  const handleBack = () => {
    dispatch({ type: "SET_STEP", payload: state.currentStep - 1 });
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleSelect = (select: string) => {
    if (select === "yes") {
      dispatch({ type: "SET_STEP", payload: state.currentStep + 1 });
    }
    if (select === "no") {
      dispatch({ type: "SET_ASSISTANT", payload: null });
      setShowAddServiceModal(true);
    }
    setOpenModal(false);
  };

  const handleAddServiceConfirm = (addMore: boolean) => {
    setShowAddServiceModal(false);

    if (addMore) {
      dispatch({ type: "ADD_APPOINTMENT_WITH_CURRENT_CUSTOMER" });
      dispatch({ type: "SET_STEP", payload: 2 });
      setOpenModalConfirm(true);

    } else {
      setShowAddCustomerModal(true);
    }
  };

  const handleAddCustomerConfirm = (addMore: boolean) => {
    if (addMore) {
      dispatch({ type: "SET_APPOINTMENT_TYPE", payload: "group" });
      dispatch({ type: "ADD_APPOINTMENT" });
      dispatch({ type: "SET_STEP", payload: 1 });
    } else {
      dispatch({ type: "SET_STEP", payload: 7 });
    }
    setShowAddServiceModal(false);
    setShowAddCustomerModal(false);
  };

  const handleBackToCalendar = () => {
    if (document.referrer) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const closeModalConfirm = async() => {
    setOpenModalConfirm(false);
  };

  const handleSetStartTime = () => {
    var beforeAppointment = state.appointments[state.currentAppointmentIndex - 1];
    var endTimeOfBeforeAppointment = '';
    if (beforeAppointment?.subServices && beforeAppointment.subServices.length > 0) {
      var lengthOfSubServices = beforeAppointment.subServices.length;
      endTimeOfBeforeAppointment = beforeAppointment.subServices[lengthOfSubServices - 1].endTime;
    } else if (beforeAppointment?.service) {
      endTimeOfBeforeAppointment = beforeAppointment.service.endTime;
    }
    state.appointments[state.currentAppointmentIndex].startTime = endTimeOfBeforeAppointment;
    setOpenModalConfirm(false);
  }

  return (
    <DefaultLayout>
      <div className="flex w-full flex-col items-center">
        <Stepper isEdit={isEdit} step={state.currentStep} />
        {state.currentStep === 1 && (
          <StepUpdateStarttime handleNext={handleNext}/>
        )}
        {state.currentStep === 2 && (
          <StepAddSummaryService
            isEdit={isEdit}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        )}
        {state.currentStep === 3 && (
          <StepAddCategory handleNext={handleNext} handleBack={handleBack} />
        )}
        {state.currentStep === 4 && (
          <StepAddService handleNext={handleNext} handleBack={handleBack} />
        )}
        {state.currentStep === 5 && (
          <StepAddSubService handleNext={handleNext} handleBack={handleBack} />
        )}
        {state.currentStep === 6 && (
          <SelectEmployee handleNext={handleNext} handleBack={handleBack} />
        )}
        {state.currentStep === 7 && (
          <ConfirmBooking appointmentData={appointmentData} isEdit={isEdit} handleBack={handleBack} handleNext={handleNext} />
        )}
      </div>
      <DialogSpecialAssistant
        openModal={openModal}
        handleClose={handleClose}
        handleSelect={handleSelect}
      />
      <AddServiceModal
        isOpen={showAddServiceModal}
        onClose={() => setShowAddServiceModal(false)}
        onConfirm={handleAddServiceConfirm}
      />
      <AddCustomerModal
        isOpen={showAddCustomerModal}
        onClose={() => setShowAddCustomerModal(false)}
        onConfirm={handleAddCustomerConfirm}
      />
      <DialogConfirm
        openModal={openModalConfirm}
        message="Do you want the start time of this new service to coincide with the previous service?"
        onClose={closeModalConfirm}
      >
        <button
          onClick={() => setOpenModalConfirm(false)}
          className="justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
        >
          {"Yes, I'm sure"}
        </button>
        <button
          onClick={() => handleSetStartTime()}
          className="justify-center	rounded bg-zinc-800	 p-3 font-medium text-gray hover:bg-opacity-90"
        >
          No, cancel
        </button>
      </DialogConfirm>
    </DefaultLayout>
  );
};

export default BookingPage;
