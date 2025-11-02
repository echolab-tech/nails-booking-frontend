"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { FcCalendar } from "react-icons/fc";
import { RiErrorWarningFill } from "react-icons/ri";
import { Spinner } from "flowbite-react";
import DateTimeCard from "./DateTimeCard";
import { appointmentsPost, updateEntireAppointment } from "../../services/appointment.service";
import ApointmentOverview from "./ApointmentOverview";
import { useAppointment } from "@/contexts/AppointmentContext";
import { toast } from "react-toastify";
import TechnicianUnavailableModal from "./TechnicianUnavailableModal";
import { createWaitList } from "../../services/waitlist.service";
import { formatDateTime } from "../utils/formatDate";
import { DialogSelectTime } from "../Dialog/DialogSelectTime";
import ConfirmOverTimeModal from "@/components/Booking/ConfirmOverTimeModal";

const ConfirmBooking = ({ handleBack, handleNext, isEdit, appointmentData, formik }: any) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openModalSelectTime, setOpenModalSelectTime] = useState<boolean>(false);
  const { state: appointmentState, dispatch } = useAppointment();
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const { state, dispatch: appointmentDispatch } = useAppointment();
  const [showConfirmOverTimeModal, setShowConfirmOverTimeModal] = useState(false);
  const [confirmModalHandlers, setConfirmModalHandlers] = useState<{
    handleConfirm: () => void;
    handleCancel: () => void;
  }>({
    handleConfirm: () => {},
    handleCancel: () => {},
  });

  useEffect(() => {}, []);

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  interface Customer {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
  }

  interface Service {
    id: string;
    title: string;
    service_id: string;
    price: number;
    duration: number;
    startTime: string;
    endTime: string;
  }

  interface ServiceCategory {
    id: string;
    name: string;
  }

  interface ServiceSummary {
    id: string;
    name: string;
  }

  interface SubService {
    id: string;
    name: string;
    price: number;
    duration: number;
    startTime: string;
    endTime: string;
  }

  interface Assistant {
    id: string;
    name: string;
    avatar?: string;
  }

  interface Appointment {
    customer?: Customer;
    service?: Service | null;
    subServices?: SubService[];
    assistant?: Assistant | null;
    serviceCategory?: ServiceCategory | null;
    serviceSummary?: ServiceSummary | null;
    startTime?: string;
    endTime?: string;
    price?: number;
    duration?: number;
  }

  interface AppointmentState {
    currentStep: number;
    selectedTime: string;
    appointments: Appointment[];
    currentAppointmentIndex: number;
    appointmentType: "single" | "group" | null;
  }

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleCancelBooking = () => {
    appointmentDispatch({ type: "RESET_APPOINTMENT" });
    setOpenModal(false);
  };

  const handleChangeTechnician = () => {
    dispatch({ type: "SET_STEP", payload: 6 });
    setOpenModal(false);
  };

  const handleWaitingList = async () => {
    try {
      const currentAppointment = state.appointments[state.currentAppointmentIndex];
      const customerId = currentAppointment?.customer?.id;
  
      if (!customerId) {
        toast.error("Không tìm thấy thông tin khách hàng");
        return;
      }
  
      // Service ID từ DB
      const mainServiceId = currentAppointment?.service?.service_id;
      if (!mainServiceId) {
        toast.error("Không tìm thấy thông tin service");
        return;
      }
  
      // SubService ID từ DB
      const subServiceId =
        currentAppointment?.subServices?.[0]?.id || null;
  
      const waitListData = {
        id_customer: customerId,
        id_service: mainServiceId,
        id_sub_service: subServiceId,
        desired_time: (() => {
          const startTime = currentAppointment?.startTime;
          if (!startTime) {
            throw new Error("Không tìm thấy thời gian đặt lịch");
          }
          
          return formatDateTime(startTime);
        })(),
      };

      // Gọi API để thêm vào waitlist
      await createWaitList(waitListData);
      
      toast.success("Đã thêm vào danh sách chờ thành công!");
      setOpenModal(false);
      appointmentDispatch({ type: "RESET_APPOINTMENT" });
      dispatch({ type: "SET_STEP", payload: 1 });
      
      // Navigate to calendar page
      router.push('/calendar');
    } catch (error: any) {
      console.error("Error adding to waiting list:", error);
      toast.error("Có lỗi xảy ra khi thêm vào danh sách chờ. Vui lòng thử lại.");
    }
  };
  
  const handleFindNewTime = () => {
    // todo
    setOpenModal(false);
    setOpenModalSelectTime(true);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = event.target.value;
    dispatch({ type: "SET_SELECTED_TIME", payload: selectedDate });
    dispatch({ type: "UPDATE_SELECTED_TIME", payload: selectedDate });
  };

  function transformFormData(state: AppointmentState) {
    const formData = {
      currentStep: state.currentStep,
      selectedTime: state.selectedTime,
      appointmentType: state.appointmentType,
      currentAppointmentIndex: state.currentAppointmentIndex,
      appointments: state.appointments.map((apt) => ({
        customer: apt.customer
          ? {
              id: apt.customer.id,
              name: apt.customer.name,
              email: apt.customer.email,
              phone: apt.customer.phone,
            }
          : null,
        service: apt.service
          ? {
              id: apt.service.id,
              title: apt.service.title,
              service_id: apt.service.service_id,
              price: apt.service.price,
              duration: apt.service.duration,
              startTime: apt.service.startTime,
              endTime: apt.service.endTime,
            }
          : null,
        subServices:
          apt.subServices?.map((sub: any) => ({
            id: sub.id,
            name: sub.name,
            price: sub.price,
            duration: sub.duration,
            startTime: sub.startTime,
            endTime: sub.endTime,
          })) || [],
        assistant: apt.assistant
          ? {
              id: apt.assistant.id,
              name: apt.assistant.name,
              avatar: apt.assistant.avatar,
            }
          : null,
        serviceCategory: apt.serviceCategory
          ? {
              id: apt.serviceCategory.id,
              name: apt.serviceCategory.name,
            }
          : null,
        serviceSummary: apt.serviceSummary
          ? {
              id: apt.serviceSummary.id,
              name: apt.serviceSummary.name,
            }
          : null,
        startTime: apt.startTime,
        endTime: apt.endTime,
        price: apt.price,
        duration: apt.duration,
      })),
    };

    return formData;
  }

  const handleCheckOverTime = (appointments:any) => {
    var endTime = '';
    appointments.forEach((appointment:any) => {
      var endTimeOflastItem = appointment?.subServices?.length > 0
        ? appointment.subServices[appointment.subServices.length - 1].endTime
        : appointment?.service?.endTime;
      if (endTime === '' || endTimeOflastItem > endTime) {
        endTime = endTimeOflastItem;
      }
    });

    return validateTime(endTime);
  }

  const validateTime = (endTime: string) => {
    const date = new Date(endTime);

    const eightPM = new Date(date);
    eightPM.setHours(20, 0, 0, 0); // 20:00:00.000
    
    const sameDay =
      date.getFullYear() === eightPM.getFullYear() &&
      date.getMonth() === eightPM.getMonth() &&
      date.getDate() === eightPM.getDate();
    return sameDay && date > eightPM;
  }

  const handleBooking = async () => {
    const formData = transformFormData(state);
    try {
      setIsLoading(true);

      if (handleCheckOverTime(state.appointments)) {
        const confirm = await showConfirmModal();
        if (! confirm) {
          return;
        }
      }
      if (isEdit) {
        formData.appointments[0].customer = appointmentData?.customer;
        const result:any = await updateEntireAppointment(appointmentData?.id, formData);
        toast.success("Appointment updated successfully!");
        handleNext(result?.data?.data?.id);
      } else {
        const result:any = await appointmentsPost(formData);
        toast.success("Appointment created successfully!");
        handleNext(result?.data?.data?.id);
      }
      appointmentDispatch({ type: "RESET_APPOINTMENT" });
    } catch (error: any) {
      if (error?.status === 422) {
        setOpenModal(true);
      } else {
        console.error("Error while posting appointment:", error);
        toast.error(
          "An error occurred while booking the appointment. Please try again.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const showConfirmModal = () => {
    return new Promise<boolean>((resolve) => {
      const handleConfirm = () => {
        setShowConfirmOverTimeModal(false);
        resolve(true);
      };
      const handleCancel = () => {
        setShowConfirmOverTimeModal(false);
        resolve(false);
      };
  
      setConfirmModalHandlers({ handleConfirm, handleCancel });
      setShowConfirmOverTimeModal(true);
    });
  };

  return (
    <div className="w-full rounded-lg bg-white p-10 shadow-lg">
      <h3 className="mb-3 text-2xl text-primary">
        Confirm your booking request
      </h3>
      <div className="mb-4 mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12 rounded-xl border border-stroke p-10 xl:col-span-6">
          <ApointmentOverview />
        </div>
        <div className="col-span-12 rounded-xl border border-stroke p-5 xl:col-span-6">
          <div className="mb-2 flex items-center">
            <FcCalendar size={30} />
            Date time
          </div>
          <div className="mb-2 flex items-center gap-4">
            <RiErrorWarningFill size={30} fill="#FEC84B" />
            Please remember your reserved time and arrive on time. Thank you
            very much
          </div>
          <DateTimeCard date={formik?.values?.startTime} />
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white disabled:bg-gray-4"
        >
          <FaArrowLeft />
          Back
        </button>
        <button
          type="button"
          onClick={handleBooking}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white disabled:bg-gray-4"
        >
          {isLoading && <Spinner />}
          {isEdit ? "Update" : "Reservations"}
          <FaArrowRight />
        </button>
      </div>
      <TechnicianUnavailableModal
        openModal={openModal}
        handleClose={handleClose}
        handleCancelBooking={handleCancelBooking}
        handleFindNewTime={handleFindNewTime}
        handleChangeTechnician={handleChangeTechnician}
        handleWaitingList={handleWaitingList}
      />
      <DialogSelectTime
        openModal={openModalSelectTime}
        message="Please select a new date and time for the additional service."
        onClose={() => setOpenModalSelectTime(false)}
        handleChangeDate={handleDateChange}
        />
      <ConfirmOverTimeModal
        isOpen={showConfirmOverTimeModal}
        onClose={confirmModalHandlers.handleCancel}
        onConfirm={confirmModalHandlers.handleConfirm}
      />
    </div>
  );
};

export default ConfirmBooking;
