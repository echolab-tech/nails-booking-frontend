"use client";
import Stepper from "../../../components/Booking/Stepper";
import StepAddSubService from "../../../components/Booking/StepAddSubService";
import ConfirmBooking from "../../../components/Booking/ConfirmBooking";
import DialogSpecialAssistant from "../../../components/DialogSpecialAssistant";
import { useFormik } from "formik";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import StepAddCustomer from "@/components/Booking/StepAddCustomer";
import StepAddSummaryService from "../../../components/Booking/StepAddSummaryService";
import StepAddCategory from "../../../components/Booking/StepAddCategory";
import StepAddService from "../../../components/Booking/StepAddService";
import { useState } from "react";
import { useRouter } from "next/navigation";

const BookingPage = () => {
  const [step, setStep] = useState<number>(1);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [showSelectAssistant, setShowSelectAssistant] =
    useState<boolean>(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      appointment_type: null,
      services: [],
      other_services: [],
      assistant: null,
      booking_time: null,
    },
    onSubmit: (values) => {},
  });

  const handleNext = (id: string) => {
    // if (step === 3 && formik.values.assistant == null) {
    //   setOpenModal(true);
    //   return;
    // }
    setStep(step + 1);
  };
  const handleBack = () => {
    formik.resetForm();
    if (step == 2 && showDetail) {
      setShowDetail(false);
      return;
    }
    if (step == 3) {
      setShowDetail(false);
    }

    if (step == 4 && showDetail) {
      setShowDetail(false);
      return;
    }

    if (step == 5 && showDetail) {
      setShowDetail(false);
      return;
    }

    setStep(step - 1);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleSelect = (select: string) => {
    if (select == "yes") {
      setStep(step + 1);
    }
    if (select == "no") {
      setStep(step + 2);
    }
    setOpenModal(false);
  };

  const handleShowDetail = () => {
    setShowDetail(true);
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
      <div className="flex flex-col w-full items-center">
        <Stepper step={step} />
        {step == 1 && (
          <StepAddCustomer
            formik={formik}
            handleBackToCalendar={handleBackToCalendar}
            handleNext={handleNext}
          />
        )}
        {step == 2 && (
          <StepAddSummaryService
            formik={formik}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        )}
        {step == 3 && (
          <StepAddCategory
            formik={formik}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        )}
        {step == 4 && (
          <StepAddService
            formik={formik}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        )}
        {step == 5 && (
          <StepAddSubService
            formik={formik}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        )}
        {step == 6 && (
          <ConfirmBooking
            formik={formik}
            handleBack={handleBack}
            handleNext={handleNext}
          />
        )}
        {/* {step == 7 && <CompleteBooking formik={formik} />} */}
      </div>
      <DialogSpecialAssistant
        openModal={openModal}
        handleClose={handleClose}
        handleSelect={(select) => handleSelect(select)}
      />
    </DefaultLayout>
  );
};

export default BookingPage;
