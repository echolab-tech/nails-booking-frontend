"use client";
import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import FullCalendar from "@fullcalendar/react";
import { LuCalendar } from "react-icons/lu";
import { LuCalendarX2 } from "react-icons/lu";
import { BiTransfer } from "react-icons/bi";
import { FaArrowRight } from "react-icons/fa6";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import scrollGridPlugin from "@fullcalendar/scrollgrid";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import { getAllAssistants } from "@/services/assistants.service";
import { Assistant, ResourceType } from "@/types/assistant";
import { BookingFormType, EventType } from "@/types/event";
import { Drawer, Modal, Spinner } from "flowbite-react";
import { FaRegPenToSquare } from "react-icons/fa6";
import { BsTrash } from "react-icons/bs";
import { GoInbox } from "react-icons/go";
import { CustomerType } from "@/types/customer";
import { getAllCustomer } from "@/services/customer.service";
import { addMinutes } from "date-fns";
import { toZonedTime, formatInTimeZone } from "date-fns-tz";
import {
  getServiceOptionShow,
  serviceOption,
} from "@/services/serviceoption.service";
import { Form, FormikProvider, useFormik } from "formik";
import {
  appointmentsPost,
  checkoutAppointment,
  getAppointmentByDate,
  getAppointmentById,
  updateAppointment,
} from "@/services/appointment.service";
import { toast } from "react-toastify";
import TipButtonGrid from "../TipButtonGrid";
import PaymentButtonGrid from "../PaymentButtonGrid";
import CashPaymentDialog from "../CashPaymentDialog";

interface SearchServiceOptionValues {
  name_service_option: string;
}

const FullCalenDarCustom: React.FC<any> = () => {
  const [resources, setResources] = useState<ResourceType[]>([]);
  const [assistantId, setAssistantId] = useState<string>("");
  const [assistant, setAssistant] = useState<Assistant>();
  const [startTime, setStartTime] = useState<string>("");
  const [openSelect, setOpenSelect] = useState<boolean>(false);
  const [openBooking, setOpenBooking] = useState<boolean>(false);
  const [isSelectService, setIsSelectService] = useState<boolean>(false);
  const [events, setEvents] = useState<EventType[]>([]);
  const [lastEventId, setLastEventId] = useState<string | null>(null);
  const [eventId, setEventId] = useState<string | null>(null);
  const [eventStatus, setEventStatus] = useState<number | undefined>();
  const [serviceOptions, setServiceOptions] = useState<any[]>([]);
  const [customerData, setCustomerData] = useState<CustomerType[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<boolean>(false);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [openTips, setOpenTips] = useState<boolean>(false);
  const [isSelectPayment, setIsSelectPayment] = useState<boolean>(false);
  const [selectTips, setSelectTips] = useState<string>("No Tips");
  const [originalTotalFee, setOriginalTotalFee] = useState<number>(0);
  const [cashPaymentVisible, setCashPaymentVisible] = useState<boolean>(false);
  const [searchServiceOptionValues, setSearchServiceOptionValues] =
    useState<SearchServiceOptionValues>({
      name_service_option: "",
    });
  useEffect(() => {
    fetchAppointments();
    fetchService();
    fetchCustomer();
    fetchServiceOption();
  }, []);

  const bookingStatus = [
    {
      value: 0,
      name: "Booked",
    },
    {
      value: 1,
      name: "Confirmed",
    },
    {
      value: 2,
      name: "Arrived",
    },
    {
      value: 3,
      name: "Start",
    },
    {
      value: 4,
      name: "Cancel",
    },
  ];
  const handleDateClick = (arg: any) => {
    alert(arg.dateStr);
  };

  const fetchService = async () => {
    getAllAssistants().then((data) => {
      setResources(data?.data?.data);
    });
  };

  const fetchAppointments = async () => {
    getAppointmentByDate().then((data) => {
      setEvents(data?.data?.data);
    });
  };

  const fetchCustomer = async () => {
    try {
      const response = await getAllCustomer("");
      setCustomerData(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchServiceOption = async () => {
    try {
      const response = await serviceOption(searchServiceOptionValues);
      setServiceOptions(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleEventClick = (arg: any) => {
    setStartTime(arg.event.startStr);
    getAppointmentById(arg?.event?.extendedProps?.booking_id).then((result) => {
      formik.setValues({
        ...formik.values,
        customer: result?.data?.data?.customer,
        services: result?.data?.data?.bookingDetails,
        totalFee: Number(result?.data?.data?.total_fee),
        totalTime: result?.data?.data?.total_time,
      });
      setEventStatus(result?.data?.data?.status);
      setSelectedCustomer(true);
      const { totalFee } = calculateTotals(result?.data?.data?.bookingDetails);
      setOriginalTotalFee(totalFee);
    });

    setAssistantId(arg?.event?.extendedProps?.assistant?.id);
    setAssistant(arg?.event?.extendedProps?.assistant);
    setEventId(arg?.event?.extendedProps?.booking_id);
    setOpenBooking(true);
    setIsSelectService(false);
  };

  const handleSelectDate = (info: any) => {
    const newEvent = {
      id: Date.now().toString(),
      title: "",
      resourceId: info.resource.id,
      start: info.startStr,
      end: info.endStr,
    };
    setLastEventId(newEvent.id);
    setAssistantId(info.resource.id);
    setAssistant(info.resource);
    setEvents((prevEvents) => [...prevEvents, newEvent]);
    setOpenSelect(true);
    setStartTime(info.startStr);
  };

  const handleResize = (info: any) => {
    alert(info.event.title + " end is now " + info.event.end.toISOString());

    if (!confirm("is this okay?")) {
      info.revert();
    }
  };

  const formatHoursMinute = (strDate: string): string => {
    const date = new Date(strDate);
    const formattedTime = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return formattedTime;
  };

  function formatDateTime(inputDateTime: string): string {
    // Create a new Date object from the ISO 8601 string
    const date = new Date(inputDateTime);

    if (isNaN(date.getTime())) {
      throw new Error("Invalid date format: unable to parse date.");
    }

    // Define options for formatting the date
    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: "short",
      day: "numeric",
      month: "short",
    };

    // Format the date part
    const formattedDate = new Intl.DateTimeFormat("en-GB", dateOptions).format(
      date,
    );

    // Format the time part
    const formattedTime = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    // Combine the formatted date and time parts
    return `${formattedDate} ${formattedTime}`;
  }

  const onCloseModalSelect = () => {
    if (lastEventId) {
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== lastEventId),
      );
      setLastEventId(null);
    }
    setOpenSelect(false);
  };

  const onCloseModalBooking = () => {
    if (lastEventId) {
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== lastEventId),
      );
      setLastEventId(null);
    }
    formik.resetForm();
    setEventId(null);
    setSelectedCustomer(false);
    setOpenBooking(false);
    setIsSelectService(false);
  };

  const onCloseTips = () => {
    setOpenTips(false);
    setSelectTips("No Tips");
    formik.resetForm();
  };

  const handleConfirmTips = () => {
    setIsSelectPayment(true);
  };

  const onCloseSelectService = () => {
    setIsSelectService(false);
  };

  const handleChangTips = (value: number | undefined, label: string) => {
    setSelectTips(label);
    if (value !== undefined) {
      formik.setFieldValue("totalFee", originalTotalFee + value);
      formik.setFieldValue("tips", [
        {
          bookingId: eventId,
          assistantId: assistantId,
          fee: value,
        },
      ]);
    } else {
      const { totalFee } = calculateTotals(formik.values.services);
      formik.setFieldValue("totalFee", totalFee);
      formik.setFieldValue("tips", []);
    }
  };

  const handleChangeMethod = (method: string) => {
    if (method === "cash") {
      setCashPaymentVisible(true);
    }
    formik.setFieldValue("paymentMethod", method);
  };

  const handleDrop = (info: any) => {
    console.log(info.event);
  };

  const handleShowService = () => {
    setIsSelectService(true);
  };

  const handleOpenBooking = () => {
    setOpenSelect(false);
    setOpenBooking(true);
  };

  const handleServiceOptionSelect = async (id: any) => {
    try {
      const result = await getServiceOptionShow(id, assistantId);
      const { serviceOptionId, title, price, time, assistant } =
        result.data.data;

      const existingOption = formik.values.services.find(
        (option) => option.serviceOptionId === serviceOptionId,
      );

      // Nếu dịch vụ đã tồn tại, không thêm lại
      if (existingOption) {
        setIsSelectService(false);
        toast.warning(
          "Select service already exists, please select another service",
        );
        return;
      }

      const timeZone = "Asia/Ho_Chi_Minh";

      // Nếu không có dịch vụ nào trước đó, sử dụng startTime
      const lastServiceEndTime =
        formik.values.services.length > 0
          ? new Date(
              formik.values.services[formik.values.services.length - 1].end,
            )
          : new Date(startTime);

      // Thời gian bắt đầu của dịch vụ mới là thời gian kết thúc của dịch vụ cuối cùng
      const newStartTime = toZonedTime(lastServiceEndTime, timeZone);
      const newEndTime = addMinutes(newStartTime, time);

      const newService = {
        id: null,
        serviceOptionId,
        title,
        price,
        time,
        assistant: {
          id: assistant.id,
          name: assistant.name,
        },
        start: formatInTimeZone(
          newStartTime,
          timeZone,
          "yyyy-MM-dd HH:mm:ssXXX",
        ),
        end: formatInTimeZone(newEndTime, timeZone, "yyyy-MM-dd HH:mm:ssXXX"),
      };

      // Cập nhật danh sách dịch vụ trong formik
      const updatedServices = [...formik.values.services, newService];
      // Tính tổng thời gian và giá
      const { totalTime, totalFee } = calculateTotals(updatedServices);
      // update value services
      formik.setFieldValue("services", updatedServices);
      // update value totalTime
      formik.setFieldValue("totalTime", totalTime);
      // update value totalFree
      formik.setFieldValue("totalFee", totalFee);
      setOriginalTotalFee(totalFee);
      setIsSelectService(false);
    } catch (error) {
      console.error("Error fetching service option details:", error);
    }
  };

  // Hàm tính tổng thời gian và giá
  const calculateTotals = (services: any[]) => {
    let totalTime = 0;
    let totalFee = 0;

    services.forEach((service) => {
      totalTime += Number(service.time);
      totalFee += Number(service.price);
    });

    return { totalTime, totalFee };
  };

  // Hàm quy đổi phút ra giờ và phút
  const formatMinutesToHoursAndMinutes = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h${minutes > 0 ? ` ${minutes}min` : ""}`;
  };

  // Hàm định dạng giá tiền thành dạng có hai chữ số thập phân
  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const handleRemoveServiceOption = (id: string) => {
    const updatedServiceOptions = formik.values.services.filter(
      (option) => option.serviceOptionId !== id,
    );
    // Tính lại tổng thời gian và giá sau khi xóa
    const { totalTime, totalFee } = calculateTotals(updatedServiceOptions);

    setOriginalTotalFee(totalFee);
    // Cập nhật giá trị totalTime và totalFee trong formik
    formik.setFieldValue("services", updatedServiceOptions);
    formik.setFieldValue("totalTime", totalTime);
    formik.setFieldValue("totalFee", totalFee);
  };

  const handleEditService = (id: string) => {};

  const handleSelectCustomer = (customer: CustomerType) => {
    formik.setValues({
      ...formik.values,
      customer: customer,
    });
    setSelectedCustomer(true);
  };

  const handleRemoveCustomer = () => {
    formik.setValues({
      ...formik.values,
      customer: null,
    });
    setSelectedCustomer(false);
  };

  const handleSearchCustomer = (event: ChangeEvent<HTMLInputElement>) => {
    const delayDebounceFn = setTimeout(async () => {
      const response = await getAllCustomer(event.target.value);
      setCustomerData(response.data.data);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  };

  const handleCheckout = async () => {
    if (eventId === null) {
      setIsSubmit(true);
      const { data } = await appointmentsPost(formik.values);
      handleSuccess("Appointment created");
      setEventId(data?.data?.id);
      getAppointmentById(data?.data?.id).then((result) => {
        formik.setValues({
          ...formik.values,
          customer: result?.data?.data?.customer,
          services: result?.data?.data?.bookingDetails,
          totalFee: Number(result?.data?.data?.total_fee),
          totalTime: result?.data?.data?.total_time,
        });
        setSelectedCustomer(true);
      });
    } else {
      setOpenBooking(false);
    }
    setOpenTips(true);
  };

  const handleCloseCashPayment = () => {
    setCashPaymentVisible(false);
    formik.setFieldValue("paymentMethod", "");
    formik.setFieldValue("payTotal", 0);
  };

  const handleSaveCashPayment = (amount: number) => {
    formik.setFieldValue("payTotal", amount);
    setCashPaymentVisible(false);
  };

  const handlePay = async () => {
    const { data } = await checkoutAppointment(eventId, formik.values);
    setOpenTips(false);
    toast.success(data.message);
    fetchAppointments();
  };
  const handleSuccess = (message: string) => {
    setIsSubmit(false);
    setOpenBooking(false);
    fetchAppointments();
    setSelectedCustomer(false);
    formik.resetForm();
    toast.success(message);
  };

  const handleError = (error: any) => {
    setIsSubmit(false);
    toast.error(error);
  };

  const formik = useFormik<BookingFormType>({
    initialValues: {
      customer: null,
      services: [],
      tips: [],
      paymentMethod: "",
      payTotal: 0,
      totalFee: 0,
      totalTime: 0,
    },
    onSubmit: async (values) => {
      setIsSubmit(true);
      try {
        if (eventId) {
          await updateAppointment(eventId, values);
          handleSuccess("Appointment updated");
        } else {
          await appointmentsPost(values);
          handleSuccess("Appointment created");
        }
      } catch (e) {
        handleError(e);
      }
    },
    enableReinitialize: true,
  });

  const renderCustomer = (customer: any) => {
    const initials = customer?.name
      .split(" ")
      .map((name: string) => name[0])
      .join("")
      .slice(0, 2);

    return (
      <div
        className="flex cursor-pointer items-center space-x-2"
        onClick={() => handleSelectCustomer(customer)}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-blue-500 text-white">
          {initials}
        </div>
        <div className="px-2 py-2">
          <h3 className="text-md font-medium">{customer?.name}</h3>
          <div>{customer?.phone}</div>
        </div>
      </div>
    );
  };

  const renderEventContent = (eventInfo: any) => {
    return (
      <>
        <b>
          {eventInfo.timeText} {eventInfo?.event?.extendedProps?.customerName}
        </b>
        <i className="block">{eventInfo.event.title}</i>
      </>
    );
  };

  const renderResourceLabelContent = (arg: any) => {
    const { resource } = arg;
    const initials = resource.title
      .split(" ")
      .map((name: string) => name[0])
      .join("")
      .slice(0, 2);

    return (
      <div className="flex flex-col items-center space-x-2">
        <div className="flex h-15 w-15 items-center justify-center rounded-full border-2 border-white bg-blue-500 text-white">
          {initials}
        </div>
        <div>{resource.title}</div>
      </div>
    );
  };

  return (
    <>
      <FullCalendar
        eventBackgroundColor="#06b6d4"
        eventBorderColor="#06b6d4"
        slotDuration="00:05:00"
        slotLabelInterval="00:15"
        allDaySlot={false}
        nowIndicator={true}
        schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
        selectable={true}
        editable={true}
        events={events}
        plugins={[
          resourceTimeGridPlugin,
          interactionPlugin,
          bootstrap5Plugin,
          scrollGridPlugin,
        ]}
        eventContent={renderEventContent}
        eventClick={handleEventClick}
        initialView="resourceTimeGridDay"
        resources={resources}
        //dateClick={handleDateClick}
        select={handleSelectDate}
        eventResize={handleResize}
        eventDrop={handleDrop}
        dayMinWidth={200}
        resourceLabelContent={renderResourceLabelContent}
      />
      {openSelect && (
        <Modal size="sm" show={openSelect} onClose={onCloseModalSelect}>
          <Modal.Header>{formatHoursMinute(startTime)}</Modal.Header>
          <Modal.Body>
            <button
              onClick={handleOpenBooking}
              type="button"
              className="inline-flex w-full items-center justify-start rounded-md bg-transparent py-2 font-medium text-black hover:bg-opacity-90 "
            >
              <LuCalendar size={25} className="mr-2" />
              Add appointment
            </button>
            <button
              type="button"
              className="inline-flex w-full items-center justify-start rounded-md bg-transparent py-2 font-medium text-black hover:bg-opacity-90 "
            >
              <AiOutlineUsergroupAdd size={25} className="mr-2" />
              Add group appointment
            </button>
            <button
              type="button"
              className="inline-flex w-full items-center justify-start rounded-md bg-transparent py-2 font-medium text-black hover:bg-opacity-90 "
            >
              <LuCalendarX2 size={25} className="mr-2" />
              Add blocked time
            </button>
          </Modal.Body>
        </Modal>
      )}
      <Drawer
        className="w-[50%] shadow-2xl"
        open={openBooking}
        onClose={onCloseModalBooking}
        position="right"
        backdrop={false}
      >
        <Drawer.Header titleIcon={() => <></>} />
        <Drawer.Items>
          <FormikProvider value={formik}>
            <Form>
              <div className="flex h-screen">
                <div className="w-[40%] overflow-auto border-r border-stroke p-6.5">
                  {/* start show info customer */}
                  {!selectedCustomer && (
                    <>
                      <h3 className="font-medium text-black dark:text-white">
                        Select a client
                      </h3>
                      <div className="w-full py-2">
                        <label
                          htmlFor="default-search"
                          className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Search
                        </label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                            <svg
                              className="text-gray-500 dark:text-gray-400 h-4 w-4"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 20 20"
                            >
                              <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                              />
                            </svg>
                          </div>
                          <input
                            type="search"
                            onChange={handleSearchCustomer}
                            id="default-search"
                            className="border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 block w-full rounded-lg border p-4 ps-10 text-sm text-gray-900 dark:text-white"
                            placeholder="Search service name"
                          />
                        </div>
                      </div>
                    </>
                  )}
                  {/* end show info customer */}
                  {selectedCustomer && (
                    <div className="flex flex-col">
                      <h3 className="text-center font-medium">
                        {formik.values?.customer?.name}
                      </h3>
                      <p className="mb-4">{formik.values?.customer?.email}</p>
                      <button
                        onClick={handleRemoveCustomer}
                        type="button"
                        className="mb-2 inline-flex w-full items-center justify-center rounded-md border border-red bg-transparent py-2 font-medium text-black text-red hover:bg-opacity-90 "
                      >
                        <BiTransfer size={25} className="mr-2" />
                        Remove customer
                      </button>
                      <button
                        type="button"
                        className="mb-2 inline-flex w-full items-center justify-center rounded-md border border-black bg-transparent py-2 font-medium text-black text-black hover:bg-opacity-90 "
                      >
                        View profile
                      </button>
                    </div>
                  )}
                  {!selectedCustomer &&
                    customerData?.map((item, index) => (
                      <div key={index} className="flex">
                        {renderCustomer(item)}
                      </div>
                    ))}
                </div>
                <div className="flex w-[60%] flex-col justify-between">
                  <div>
                    <div className="flex justify-between px-6.5">
                      <h3 className="text-2xl font-bold	text-black">{`${startTime && formatDateTime(startTime)}`}</h3>
                      {eventId && (
                        <select
                          id="status"
                          className="bg-gray-50 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 block w-[150px] rounded-lg border p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        >
                          {bookingStatus?.map((item, i) => (
                            <option value={item?.value} key={i}>
                              {item?.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div className="px-6.5">
                      <h3 className="font-medium text-black dark:text-white">
                        Services
                      </h3>
                      {formik.values.services.length > 0 ? (
                        formik.values.services.map(
                          (detail: any, index: number) => (
                            <div
                              className="service relative mt-3 w-full"
                              key={index}
                            >
                              <div className="absolute bottom-0 left-0 top-0 w-1 bg-blue-500"></div>
                              <div className="flex flex-1 px-6.5 py-4">
                                <div className="w-full xl:w-3/4">
                                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    {detail?.title}
                                  </label>
                                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    {detail?.name}
                                  </label>
                                  <div className="flex items-center">
                                    <span>
                                      {formatHoursMinute(detail?.start)}
                                    </span>
                                    <span className="m-1">・</span>
                                    <span>
                                      {detail?.time}
                                      min
                                    </span>
                                    <span className="m-1">・</span>
                                    <span>{detail?.assistant?.name}</span>
                                  </div>
                                </div>
                                <div className="w-full xl:w-1/4">
                                  <label className="mb-3 ml-3 block flex justify-end text-sm font-medium text-black dark:text-white">
                                    ${detail.price}
                                  </label>
                                  <div className="flex justify-end space-x-3.5">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleEditService(detail?.id)
                                      }
                                      className="hover:text-primary"
                                    >
                                      <FaRegPenToSquare
                                        size={25}
                                        className="text-black"
                                      />
                                    </button>
                                    <button
                                      type="button"
                                      className="hover:text-primary"
                                      onClick={() =>
                                        handleRemoveServiceOption(
                                          detail.serviceOptionId,
                                        )
                                      }
                                    >
                                      <BsTrash
                                        size={25}
                                        className="text-black"
                                      />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ),
                        )
                      ) : (
                        <div className="flex min-h-[200px] flex-col items-center">
                          <GoInbox size={50} />
                          <p>Add a service to save the appointment</p>
                        </div>
                      )}
                    </div>
                    {eventStatus !== 5 && (
                      <div className="flex justify-center px-6.5 py-4">
                        <button
                          onClick={handleShowService}
                          type="button"
                          className="border-gray-300 hover:bg-gray-100 focus:ring-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 mb-2 me-2 rounded-full border bg-white px-5 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 dark:text-white"
                        >
                          Add Service
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col px-6.5">
                    <div className="flex justify-between">
                      <h3 className="font-2xl text-lg font-bold text-black">
                        Total
                      </h3>
                      <div className="flex gap-2">
                        <span className="text-lg font-bold text-black">
                          {formatPrice(formik.values.totalFee)}
                        </span>
                        <span className="text-md">
                          {formatMinutesToHoursAndMinutes(
                            formik.values.totalTime,
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {eventStatus === 5 ? (
                        <button
                          type="button"
                          className="border-gray-300 inline-flex w-full items-center justify-center rounded-md border bg-transparent px-10 py-2 text-center font-medium text-black hover:bg-opacity-90 lg:px-8 xl:px-10"
                        >
                          {isSubmit && <Spinner />}
                          View Payment
                        </button>
                      ) : (
                        <>
                          <button
                            disabled={isSubmit}
                            type="button"
                            onClick={handleCheckout}
                            className="border-gray-300 inline-flex w-1/2 items-center justify-center rounded-md border bg-transparent px-10 py-2 text-center font-medium text-black hover:bg-opacity-90 lg:px-8 xl:px-10"
                          >
                            {isSubmit && <Spinner />}
                            Checkout
                          </button>
                          <button
                            disabled={isSubmit}
                            type="submit"
                            className="inline-flex w-1/2 items-center justify-center rounded-md bg-black px-10 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                          >
                            {isSubmit && <Spinner />}
                            Save
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </FormikProvider>
        </Drawer.Items>
      </Drawer>
      {/* start draw select service  */}
      <Drawer
        className="w-[30%]"
        open={isSelectService}
        onClose={onCloseSelectService}
        position="right"
        backdrop={false}
      >
        <Drawer.Header titleIcon={() => <></>} closeIcon={FaArrowRight} />
        <Drawer.Items>
          {isSelectService && (
            <div className="px-6.5">
              {serviceOptions?.map((item, index) => (
                <div key={index}>
                  <h3 className="mt-3 font-medium text-black dark:text-white">
                    {item?.category_name} ({item?.count})
                  </h3>
                  <div className="space-y-6">
                    {item?.service_options.length > 0 &&
                      item?.service_options.map(
                        (option: any, index: number) => (
                          <button
                            type="button"
                            className="service relative mt-3 w-full text-left"
                            key={index}
                            onClick={() =>
                              handleServiceOptionSelect(option?.id)
                            }
                          >
                            <div className="absolute bottom-0 left-0 top-0 w-1 bg-blue-500"></div>
                            <div className="flex flex-1 px-4 py-2">
                              <div className="w-full xl:w-3/4">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                  {option?.title}
                                </label>
                                <div className="flex items-center">
                                  <span>{option?.duration}min</span>
                                  <span className="ml-5">
                                    {/* {option.assistant.name} */}
                                  </span>
                                </div>
                              </div>
                              <div className="w-full xl:w-1/4">
                                <label className="mb-3 block flex justify-end text-sm font-medium text-black dark:text-white">
                                  ${option?.price}
                                </label>
                              </div>
                            </div>
                          </button>
                        ),
                      )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Drawer.Items>
      </Drawer>
      {/* start draw tips */}
      <Drawer
        className="w-[80%] shadow-2xl"
        open={openTips}
        onClose={onCloseTips}
        position="right"
        backdrop={false}
      >
        <Drawer.Header titleIcon={() => <></>} />
        <Drawer.Items>
          <div className="flex h-screen">
            <div className="w-[60%] overflow-auto border-r border-stroke p-6.5">
              <h3 className="mb-2 text-2xl font-bold text-black">
                {isSelectPayment ? "Select Payment" : "Select tip"}
              </h3>
              {isSelectPayment ? (
                <PaymentButtonGrid
                  value={formik.values.paymentMethod}
                  onChange={(method) => handleChangeMethod(method)}
                />
              ) : (
                <TipButtonGrid
                  totalAmount={originalTotalFee}
                  value={selectTips}
                  onChange={(value, label) => handleChangTips(value, label)}
                />
              )}
            </div>
            <div className="flex w-[40%] flex-col justify-between">
              <div className="p-6.5">
                <div className="flex flex-col">
                  <h3 className="text-center font-medium">
                    {formik.values?.customer?.name}
                  </h3>
                  <p className="mb-4">{formik.values?.customer?.email}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleRemoveCustomer}
                      type="button"
                      className="mb-2 inline-flex w-full items-center justify-center rounded-md border border-red bg-transparent py-2 font-medium text-black text-red hover:bg-opacity-90 "
                    >
                      <BiTransfer size={25} className="mr-2" />
                      Remove customer
                    </button>
                    <button
                      type="button"
                      className="mb-2 inline-flex w-full items-center justify-center rounded-md border border-black bg-transparent py-2 font-medium text-black text-black hover:bg-opacity-90 "
                    >
                      View profile
                    </button>
                  </div>
                </div>
                {formik.values.services.length > 0 &&
                  formik.values.services.map((detail: any, index: number) => (
                    <div className="service relative mt-3 w-full" key={index}>
                      <div className="absolute bottom-0 left-0 top-0 w-1 bg-blue-500"></div>
                      <div className="flex flex-1 px-6.5 py-4">
                        <div className="w-full xl:w-3/4">
                          <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                            {detail?.title}
                          </label>
                          <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                            {detail?.name}
                          </label>
                          <div className="flex items-center">
                            <span>{formatHoursMinute(detail?.start)}</span>
                            <span className="m-1">・</span>
                            <span>
                              {detail?.time}
                              min
                            </span>
                            <span className="m-1">・</span>
                            <span>{detail?.assistant?.name}</span>
                          </div>
                        </div>
                        <div className="w-full xl:w-1/4">
                          <label className="mb-3 ml-3 block flex justify-end text-sm font-medium text-black dark:text-white">
                            ${detail.price}
                          </label>
                          <div className="flex justify-end space-x-3.5">
                            <button
                              type="button"
                              onClick={() =>
                                handleEditService(detail?.serviceOptionId)
                              }
                              className="hover:text-primary"
                            >
                              <FaRegPenToSquare
                                size={25}
                                className="text-black"
                              />
                            </button>
                            <button
                              className="hover:text-primary"
                              onClick={() =>
                                handleRemoveServiceOption(
                                  detail.serviceOptionId,
                                )
                              }
                            >
                              <BsTrash size={25} className="text-black" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="border-t border-stroke p-6.5">
                {/* show info tips */}
                {formik.values.tips.length > 0 && (
                  <div className="flex justify-between">
                    <h3 className="font-xl text-lg text-black">
                      Tips for {assistant?.name}
                    </h3>
                    <span className="text-lg font-bold text-black">
                      {formatPrice(formik.values.tips[0].fee)}
                    </span>
                  </div>
                )}
                {/* show total fee */}
                <div className="flex justify-between">
                  <h3 className="font-2xl text-lg font-bold text-black">
                    Total
                  </h3>
                  <div className="flex gap-2">
                    <span className="text-lg font-bold text-black">
                      {formatPrice(formik.values.totalFee)}
                    </span>
                    <span className="text-md">
                      {formatMinutesToHoursAndMinutes(formik.values.totalTime)}
                    </span>
                  </div>
                </div>
                {formik.values.paymentMethod !== "" && (
                  <div className="flex justify-between">
                    <h3 className="font-2xl text-lg font-bold text-black">
                      {formik.values.paymentMethod}
                    </h3>
                    <div className="flex">
                      <span className="text-lg font-bold text-black">
                        {formatPrice(formik.values.payTotal)}
                      </span>
                    </div>
                  </div>
                )}
                {!isSelectPayment ? (
                  <button
                    disabled={isSubmit}
                    type="button"
                    onClick={handleConfirmTips}
                    className="border-gray-300 inline-flex w-full items-center justify-center rounded-md border bg-black px-10 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                  >
                    {isSubmit && <Spinner />}
                    Continue to payment
                  </button>
                ) : (
                  <button
                    disabled={isSubmit || formik.values.paymentMethod == ""}
                    type="button"
                    onClick={handlePay}
                    className="border-gray-300 inline-flex w-full items-center justify-center rounded-md border bg-black px-10 py-2 text-center font-medium text-white hover:bg-opacity-90 disabled:bg-gray lg:px-8 xl:px-10"
                  >
                    {isSubmit && <Spinner />}
                    Pay now
                  </button>
                )}
              </div>
            </div>
          </div>
        </Drawer.Items>
      </Drawer>
      {cashPaymentVisible && (
        <CashPaymentDialog
          isVisible={cashPaymentVisible}
          onClose={handleCloseCashPayment}
          onSave={(amount) => handleSaveCashPayment(amount)}
          initialAmount={formik.values.totalFee}
        />
      )}
    </>
  );
};

export default FullCalenDarCustom;
