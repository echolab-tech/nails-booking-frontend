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

const BookingPage = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const router = useRouter();
  const { state, dispatch } = useAppointment();
  const [appointmentData, setAppointmentData] = useState<any | null>(null);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);


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
    setAppointmentData(data?.data?.data);
    dispatch({ type: "SET_ASSISTANT", payload: data?.data?.data?.bookingDetails[0].assistant });
  }

  const handleNext = () => {
    if (state.currentStep === 5) {
      setOpenModal(true);
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

  return (
    <DefaultLayout>
      <div className="flex w-full flex-col items-center">
        <Stepper isEdit={isEdit} step={state.currentStep} />
        {state.currentStep === 1 && (
          <StepUpdateStarttime handleNext={handleNext} handleBack={handleBack} />
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
    </DefaultLayout>
  );
};

export default BookingPage;
