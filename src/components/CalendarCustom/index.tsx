"use client";
import React, {
  useState,
  useEffect,
  ChangeEvent,
  useRef,
  useCallback,
} from "react";
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
import { Datepicker, Drawer, FileInput, Modal, Spinner } from "flowbite-react";
import { FaRegPenToSquare } from "react-icons/fa6";
import { BsTrash } from "react-icons/bs";
import { GoInbox } from "react-icons/go";
import { CustomerType } from "@/types/customer";
import { getAllCustomer, getStatus } from "@/services/customer.service";
import { addMinutes, format } from "date-fns";
import { toZonedTime, formatInTimeZone } from "date-fns-tz";
import { useRouter } from "next/navigation";
import { useAppointment } from "@/contexts/AppointmentContext";
import {
  getServiceOptionShow,
  serviceOption,
} from "@/services/serviceoption.service";
import { Form, FormikProvider, useFormik, Field } from "formik";
import {
  appointmentsPost,
  appointmentsUpdateStatus,
  checkoutAppointment,
  getAppointmentByDate,
  getAppointmentById,
  updateAppointment,
} from "@/services/appointment.service";
import { toast } from "react-toastify";
import { BlockTimeType } from "@/types/BlockTime";
import {
  addBlockedTime,
  getBlockTimes,
  getBlockType,
} from "@/services/blocktime.service";
import TipButtonGrid from "../TipButtonGrid";
import PaymentButtonGrid from "../PaymentButtonGrid";
import CashPaymentDialog from "../CashPaymentDialog";

const generateTimeOptions = () => {
  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 5) {
      const value = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

      const hour12 = hour % 12 || 12;
      const period = hour < 12 ? "AM" : "PM";
      const label = `${hour12}:${String(minute).padStart(2, "0")} ${period}`;

      timeOptions.push({ value, label });
    }
  }
  return timeOptions;
};

const timeOptions = generateTimeOptions();

const frequencyOptions = [
  { value: "1", label: "Don't Repeat" },
  { value: "2", label: "Every Day" },
  { value: "3", label: "Every Week" },
  { value: "4", label: "Every Month" },
];

interface SearchServiceOptionValues {
  name_service_option: string;
}

const FullCalenDarCustom: React.FC<any> = () => {
  const [resources, setResources] = useState<ResourceType[]>([]);
  const [assistantId, setAssistantId] = useState<string>("");
  const [dateTime, setDateTime] = useState<string>("");
  const [assistant, setAssistant] = useState<Assistant>();
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [blockType, setBlockType] = useState<
    { id: number; name_block_type: string }[]
  >([]);
  const [openSelect, setOpenSelect] = useState<boolean>(false);
  const [openBooking, setOpenBooking] = useState<boolean>(false);
  const [openBlockTime, setOpenBlockTime] = useState<boolean>(false);
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

  const [bookingDetail, setBookingDetail] = useState<any | null>(null);
  const [isUpdateAssistant, setIsUpdateAssistant] = useState<boolean>(false);
  const [serviceOptionUpdateId, setServiceOptionUpdateId] = useState<
    any | null
  >(null);
  const [showEndOptions, setShowEndOptions] = useState<boolean>(false);
  const [showSpecialEndDate, setShowSpecialEndDate] = useState<boolean>(false);
  const [showCustomTitle, setShowCustomTitle] = useState<boolean>(false);
  const [calendarStartDate, setCalendarStartDate] = useState<string>("");
  const [calendarEndDate, setCalendarEndDate] = useState<string>("");

  const [serviceOptionUpdateIdNew, setServiceOptionUpdateIdNew] = useState<
    any | null
  >(null);
  const [status, setStatus] = useState<
    { id: number; name_status: string; color_code: string }[]
  >([]);
  const router = useRouter();
  const { dispatch } = useAppointment();

  useEffect(() => {
    fetchService();
    fetchCustomer();
    fetchServiceOption();
    fetchDataBlockType();
    fetchDataStatus();
  }, [calendarStartDate, calendarEndDate]);

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
      name: "Started",
    },
    {
      value: 4,
      name: "No-show",
    },
    {
      value: 5,
      name: "Cancel",
    },
  ];
  const handleDateClick = (arg: any) => {
    setDateTime(arg.dateStr);
  };

  const fetchService = async () => {
    getAllAssistants().then((data) => {
      setResources(data?.data?.data);
    });
  };

  // const fetchAppointments = async () => {
  //   getAppointmentByDate().then((data) => {
  //     setEvents(data?.data?.data);
  //   });
  // };

  const handleAddBooking = () => {
    dispatch({ type: "SET_SELECTED_TIME", payload: startTime });
    router.push(`/booking/new`);
  };

  const fetchAllData = async (start: string, end: string) => {
    try {
      // Đợi cả hai API call hoàn thành
      const [appointmentsResponse, blockTimesResponse] = await Promise.all([
        getAppointmentByDate(start, end),
        getBlockTimes(start, end),
      ]);

      // Xử lý dữ liệu từ cả hai API
      const appointments = appointmentsResponse?.data?.data.map(
        (appointment: any) => ({
          ...appointment,
          type: "appointment",
        }),
      );

      const blockTimes = blockTimesResponse?.data?.data.map(
        (blockTime: any) => ({
          ...blockTime,
          type: "blocktime",
        }),
      );

      // Gộp hai mảng thành một mảng events
      const combinedEvents = [...appointments, ...blockTimes];

      // Cập nhật lại events
      setEvents(combinedEvents);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchCustomer = async () => {
    try {
      const response = await getAllCustomer("");
      setCustomerData(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const fetchDataStatus = async () => {
    const response = await getStatus();
    const dataStatus = response.data.dataStatus;
    setStatus(dataStatus);
  };

  const fetchServiceOption = async () => {
    try {
      const response = await serviceOption(searchServiceOptionValues);
      setServiceOptions(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchDataBlockType = async () => {
    //const blockType = await getBlockType();
    // setBlockType(blockType.data.dataBlockType);
    setBlockType([
      { id: 1, name_block_type: "Lunch" },
      { id: 2, name_block_type: "Meeting" },
      { id: 3, name_block_type: "Training" },
      { id: 4, name_block_type: "Custom" },
    ]);
  };

  // const fetchBlockTimes = async () => {
  //   try {
  //     const response = await getBlockTimes();
  //     setBlockTimes(response.data.data);
  //   } catch (error) {
  //     console.error("Error fetching categories:", error);
  //   }
  // };

  const handleEventClick = (arg: any) => {
    const eventType = arg?.event?.extendedProps?.type;
    setStartTime(arg.event.startStr);
    if (eventType == "blocktime") {
      setOpenBlockTime(true);
      return;
    }
    getAppointmentById(arg?.event?.extendedProps?.booking_id).then((result) => {
      formik.setValues({
        ...formik.values,
        customer: result?.data?.data?.customer,
        services: result?.data?.data?.bookingDetails,
        totalFee: Number(result?.data?.data?.total_fee),
        totalTime: result?.data?.data?.total_time,
        description: result?.data?.data?.description,
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
    // setStatus()
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
    setEndTime(info.endStr);
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

  const formatDateTimeCustom = (dateTime: string) => {
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

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

  const onCloseModalBlockTime = () => {
    if (lastEventId) {
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== lastEventId),
      );
      setLastEventId(null);
    }
    setShowEndOptions(false);
    setShowSpecialEndDate(false);
    setOpenBlockTime(false);
  };

  const handleDrop = (info: any) => {
    const timeZone = "Asia/Ho_Chi_Minh";

    getAppointmentById(info.event._def.extendedProps?.booking_id).then(
      (result) => {
        formik.setValues({
          ...formik.values,
          customer: result?.data?.data?.customer,
          services: result?.data?.data?.bookingDetails,
          totalFee: Number(result?.data?.data?.total_fee),
          totalTime: result?.data?.data?.total_time,
        });
        setEventStatus(result?.data?.data?.status);
        setSelectedCustomer(true);
        const { totalFee } = calculateTotals(
          result?.data?.data?.bookingDetails,
        );
        setOriginalTotalFee(totalFee);
        const originalServices = result?.data?.data?.bookingDetails;
        const selectedAssistant = info.event._def.resourceIds[0];

        getServiceOptionShow(
          info.event._def.extendedProps?.serviceOptionId,
          selectedAssistant,
        ).then((service) => {
          const { price, assistant, time } = service.data.data;

          // Tìm kiếm service option
          const existingOption = originalServices.find(
            (option: any) =>
              option.serviceOptionId ===
              info.event._def.extendedProps?.serviceOptionId,
          );

          if (existingOption) {
            const lastServiceEndTime = new Date(info.event.startStr);

            const newStartTime = toZonedTime(lastServiceEndTime, timeZone);
            const newEndTime = addMinutes(newStartTime, time);
            // Nếu tìm thấy serviceOption, cập nhật các giá trị
            existingOption.serviceOptionId = service.data.data.serviceOptionId;
            existingOption.price = price;
            existingOption.time = time;
            existingOption.assistant = {
              id: assistant.id,
              name: assistant.name,
            };
            existingOption.end = formatInTimeZone(
              newEndTime,
              timeZone,
              "yyyy-MM-dd HH:mm:ssXXX",
            );
            existingOption.start = formatInTimeZone(
              newStartTime,
              timeZone,
              "yyyy-MM-dd HH:mm:ssXXX",
            );
          }

          const { totalTime, totalFee } = calculateTotals(originalServices);
          let values = {
            customer: result?.data?.data?.customer,
            services: [...originalServices],
            tips: [],
            paymentMethod: "",
            description: "",
            payTotal: 0,
            totalFee: totalFee,
            totalTime: totalTime,
          };
          updateAppointment(
            info.event._def.extendedProps.booking_id,
            values,
          ).then((result) => {
            handleSuccess("Appointment updated");
          });
        });
      },
    );
  };

  const handleShowService = () => {
    setIsSelectService(true);
  };

  const handleOpenBooking = () => {
    setOpenSelect(false);
    setOpenBooking(true);
  };

  const getCustomerColor = (stt: number) => {
    const statusFound = status.find((s: any) => s.id === stt);
    return statusFound?.color_code;
  };

  const handleOpenBlockTime = () => {
    setOpenSelect(false);
    setOpenBlockTime(true);
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

  const handleRemoveServiceOptionDetail = (id: string) => {
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
    setIsUpdateAssistant(false);
  };

  const handleEditService = async (id: any) => {
    setIsUpdateAssistant(true);
    setServiceOptionUpdateId(id);
    const existingOption = formik.values.services.find(
      (option) => option.serviceOptionId === id,
    );
    setBookingDetail(existingOption);
  };
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setBookingDetail((prevDetail: any) => ({
      ...prevDetail,
      [name]: value,
    }));
  };

  const handleAssistantChange = async (e: any) => {
    const selectedAssistant = e.target.value;
    const result = await getServiceOptionShow(
      serviceOptionUpdateId,
      selectedAssistant,
    );
    setServiceOptionUpdateIdNew(result.data.data.serviceOptionId);
    const { price, assistant, time } = result.data.data;
    setBookingDetail((prevDetail: any) => ({
      ...prevDetail,
      price: price,
      time: time,
      assistant: {
        id: assistant?.id,
        name: assistant?.name,
      },
    }));
  };

  const handleUpdateAssistant = () => {
    const timeZone = "Asia/Ho_Chi_Minh";
    const { price, assistant, time } = bookingDetail;
    const existingOption = formik.values.services.find(
      (option) => option.serviceOptionId === serviceOptionUpdateId,
    );
    const newStartTime = toZonedTime(bookingDetail.start, timeZone);
    const newEndTime = addMinutes(newStartTime, time);
    if (existingOption) {
      // Cập nhật các giá trị của existingOption với newService
      existingOption.serviceOptionId = serviceOptionUpdateIdNew;
      existingOption.price = price;
      existingOption.time = time;
      (existingOption.end = formatInTimeZone(
        newEndTime,
        timeZone,
        "yyyy-MM-dd HH:mm:ssXXX",
      )),
        (existingOption.assistant = {
          id: assistant.id,
          name: assistant.name,
        });

      // Cập nhật lại giá trị trong Formik
      formik.setFieldValue("services", [...formik.values.services]);

      // Tính toán sau khi đã cập nhật danh sách dịch vụ
      const { totalTime, totalFee } = calculateTotals(formik.values.services);
      formik.setFieldValue("totalTime", totalTime);
      formik.setFieldValue("totalFee", totalFee);
      setOriginalTotalFee(totalFee);
      setIsUpdateAssistant(false);
    }
  };

  const onCloseEditService = () => {
    setIsUpdateAssistant(false);
  };

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
    fetchAllData(
      format(new Date(), "dd-MM-yyyy"),
      format(new Date(), "dd-MM-yyyy"),
    );
  };
  const handleSuccess = (message: string) => {
    setIsSubmit(false);
    setOpenBooking(false);
    fetchAllData(
      format(new Date(), "dd-MM-yyyy"),
      format(new Date(), "dd-MM-yyyy"),
    );
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
      description: null,
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

  const formikBlockTime = useFormik<BlockTimeType>({
    initialValues: {
      assistant_id: assistantId,
      reason: "",
      block_type: "1",
      date: formatDateTimeCustom(dateTime),
      start_time: formatHoursMinute(startTime),
      end_time: formatHoursMinute(endTime),
      frequency: "1",
      title: "",
      end: "never",
      special_end_date: "",
    },
    onSubmit: async (values) => {
      setIsSubmit(true);
      addBlockedTime(values)
        .then((data) => {
          setIsSubmit(false);
          onCloseModalBlockTime();
          formikBlockTime.resetForm();
          fetchAllData(
            format(new Date(), "dd-MM-yyyy"),
            format(new Date(), "dd-MM-yyyy"),
          );
          toast.success("Block time created");
        })
        .catch((e) => {
          setIsSubmit(false);
          toast.error(e);
        });
    },
    enableReinitialize: true,
  });

  const renderCustomer = (customer: any) => {
    const initials = customer?.name
      ? customer?.name
          .split(" ")
          .map((name: string) => name[0])
          .join("")
          .slice(0, 2)
      : "N/A";

    return (
      <div
        className="relative flex w-full cursor-pointer items-center space-x-2"
        onClick={() => handleSelectCustomer(customer)}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-blue-500 text-white">
          {initials}
        </div>
        <div className="px-2 py-2">
          <h3 className="text-md font-medium">{customer?.name}</h3>
          <div>{customer?.phone}</div>
        </div>
        <div
          className={`absolute right-0 top-[40%] inline-flex h-6 w-6 items-center justify-center rounded-full border text-sm font-medium`}
          style={{
            backgroundColor: `${getCustomerColor(customer?.status)}`,
          }}
        ></div>
      </div>
    );
  };

  const renderEventContent = (eventInfo: any) => {
    var data = eventInfo?.event?.extendedProps;
    return (
      <>
        <b>
          {eventInfo.timeText} {data?.customerName}
        </b>
        <i className="block">Phone Number: {data?.booking?.customer?.phone}</i>
        <i className="block">Service Name: {eventInfo.event.title}</i>
        <i className="block">Request a worker: {data?.booking.booking_type ? 'Yes' : 'No'}</i>
        {data?.group_id !== null && (
            <i className="block">Has a group booking (Group ID: {eventInfo.event.extendedProps.group_id})</i>
        )}
        {data?.booking?.description != null && (
          <i className="block">
            Note: {data.booking.description}
          </i>
        )}
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
        {resource?.extendedProps?.avatar ? (
          <div className="flex items-center justify-center">
            <img
              src={resource?.extendedProps?.avatar}
              alt="avatar"
              className="h-[60px] w-[60px] rounded-full object-cover"
            />
          </div>
        ) : (
          <div className="flex h-15 w-15 items-center justify-center rounded-full border-2 border-white bg-blue-500 text-white">
            {initials}
          </div>
        )}

        <div>{resource.title}</div>
      </div>
    );
  };

  const handleChangeStatus = async (event: any) => {
    const { value } = event.target;
    try {
      await appointmentsUpdateStatus(eventId, value);
      fetchAllData(calendarStartDate, calendarEndDate);
      setOpenBooking(false);
      toast.success("Status appointment updated successfully.");
    } catch (error) {
      toast.error("Failed to update status appointment.");
    }
  };

  const handleDatesSet = (dateInfo: any) => {
    const { start, end } = dateInfo;
    setCalendarStartDate(format(start, "dd-MM-yyyy"));
    setCalendarEndDate(format(end, "dd-MM-yyyy"));
    fetchAllData(format(start, "dd-MM-yyyy"), format(end, "dd-MM-yyyy"));
  };

  console.log('events', events);
  

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
        selectAllow={(selectInfo) => {
          const now = new Date();
          return selectInfo.start >= now;
        }}
        eventAllow={(dropInfo, draggedEvent) => {
          const now = new Date();
          return dropInfo.start >= now;
        }}
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
        dateClick={handleDateClick}
        select={handleSelectDate}
        eventResize={handleResize}
        eventDrop={handleDrop}
        dayMinWidth={200}
        resourceLabelContent={renderResourceLabelContent}
        datesSet={handleDatesSet}
        slotMinTime="09:00:00" // Start time at 9 AM
        slotMaxTime="20:00:00" // End time at 8 PM
        headerToolbar={{
          right: "today prev,next,resourceTimeGridDay,resourceTimeGridWeek",
          left: "title",
        }}
        titleFormat={{
          weekday: "long", // Display the full day of the week
          year: "numeric", // Display the year
          month: "long", // Display the full month name
          day: "numeric", // Display the day number
        }}
      />
      {openSelect && (
        <Modal size="sm" show={openSelect} onClose={onCloseModalSelect}>
          <Modal.Header>{formatHoursMinute(startTime)}</Modal.Header>
          <Modal.Body>
            <button
              onClick={handleAddBooking}
              type="button"
              className="inline-flex w-full items-center justify-start rounded-md bg-transparent py-2 font-medium text-black hover:bg-opacity-90 "
            >
              <LuCalendar size={25} className="mr-2" />
              Add appointment
            </button>
            {/* <button
              type="button"
              className="inline-flex w-full items-center justify-start rounded-md bg-transparent py-2 font-medium text-black hover:bg-opacity-90 "
            >
              <AiOutlineUsergroupAdd size={25} className="mr-2" />
              Add group appointment
            </button> */}
            <button
              onClick={handleOpenBlockTime}
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
        className="max-h-dvh w-full shadow-2xl lg:w-[50%] xl:w-[50%]"
        open={openBooking}
        onClose={onCloseModalBooking}
        position="right"
        backdrop={false}
      >
        <Drawer.Header titleIcon={() => <></>} />
        <Drawer.Items className="h-[95%]">
          <FormikProvider value={formik}>
            <Form className="h-full">
              <div className="flex h-full">
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
                              className="text-gray-500 h-4 w-4 dark:text-gray-400"
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
                            className="dark:bg-gray-700 dark:border-gray-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 ps-10 text-sm text-gray-900 dark:text-white dark:placeholder-gray-400"
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
                <div className="flex h-full w-[60%] flex-col justify-between">
                  <div className="h-full">
                    <div className="flex justify-between px-6.5">
                      <h3 className="text-2xl font-bold	text-black">{`${startTime && formatDateTime(startTime)}`}</h3>
                      {eventId && (
                        <select
                          id="status"
                          name="status"
                          value={eventStatus}
                          onChange={handleChangeStatus}
                          className="dark:bg-gray-700 dark:border-gray-600 block w-[150px] rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        >
                          {bookingStatus?.map((item, i) => (
                            <option value={item?.value} key={i}>
                              {item?.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div className="max-h-[85%] overflow-y-auto px-6.5">
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
                                        handleEditService(
                                          detail?.serviceOptionId,
                                        )
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
                        <div className="flex min-h-[100px] flex-col items-center">
                          <GoInbox size={50} />
                          <p>Add a service to save the appointment</p>
                        </div>
                      )}
                      {eventStatus !== 5 && (
                        <div className="flex justify-center px-6.5 py-4">
                          <button
                            onClick={handleShowService}
                            type="button"
                            className="dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 mb-2 me-2 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:text-white"
                          >
                            Add Service
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col px-6.5">
                    <div className="mb-4">
                      <label htmlFor="title"> Note</label>
                      <Field
                        type="text"
                        name="description"
                        value={formik.values.description}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>
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
                          className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-transparent px-10 py-2 text-center font-medium text-black hover:bg-opacity-90 lg:px-8 xl:px-10"
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
                            className="inline-flex w-1/2 items-center justify-center rounded-md border border-gray-300 bg-transparent px-10 py-2 text-center font-medium text-black hover:bg-opacity-90 lg:px-8 xl:px-10"
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
      <Drawer
        className="flex h-full w-[30%] flex-col p-6"
        open={openBlockTime}
        onClose={onCloseModalBlockTime}
        position="right"
        backdrop={false}
      >
        <Drawer.Header titleIcon={() => <></>} />
        <Drawer.Items>
          <FormikProvider value={formikBlockTime}>
            <Form>
              <div className="flex h-screen">
                <div className="w-full overflow-auto">
                  <div className="mb-4">
                    <h3 className="mb-4 text-2xl font-bold	text-black">
                      {" "}
                      Add blocked time
                    </h3>
                    <Field
                      as="select"
                      type="text"
                      name="block_type"
                      onChange={(e: any) => {
                        formikBlockTime.handleChange(e);
                        setShowCustomTitle(e.target.value === "4");
                      }}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    >
                      {blockType.map((block) => (
                        <option key={block.id} value={block.id}>
                          {block.name_block_type}
                        </option>
                      ))}
                    </Field>
                  </div>
                  {showCustomTitle && (
                    <div className="mb-4">
                      <label htmlFor="title">Title</label>
                      <Field
                        type="text"
                        name="title"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>
                  )}
                  <div className="mb-4">
                    <label htmlFor="reason">Description</label>
                    <Field
                      as="textarea"
                      type="text"
                      name="reason"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="date">Date</label>
                    <input
                      id="date"
                      name="date"
                      type="date"
                      value={formikBlockTime.values.date}
                      onChange={(e) => {
                        formikBlockTime.handleChange(e);
                        setDateTime(e.target.value);
                      }}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="mb-4 flex">
                    <div className="w-1/2 pr-2">
                      <label htmlFor="startTime">Start Time</label>
                      <Field
                        as="select"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        name="start_time"
                      >
                        {timeOptions.map((time) => (
                          <option key={time.value} value={time.value}>
                            {time.label}
                          </option>
                        ))}
                      </Field>
                    </div>
                    <div className="w-1/2 pl-2">
                      <label htmlFor="endTime">End Time</label>
                      <Field
                        as="select"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        name="end_time"
                      >
                        {timeOptions.map((time) => (
                          <option key={time.value} value={time.value}>
                            {time.label}
                          </option>
                        ))}
                      </Field>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="teamMember">Team Member</label>
                    <Field
                      as="select"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      name="assistant_id"
                    >
                      {resources.map((resource) => (
                        <option key={resource.id} value={resource.id}>
                          {resource?.title}
                        </option>
                      ))}
                    </Field>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="frequency">Frequency</label>
                    <Field
                      as="select"
                      name="frequency"
                      onChange={(e: any) => {
                        formikBlockTime.handleChange(e);
                        setShowEndOptions(e.target.value !== "1");
                      }}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    >
                      {frequencyOptions.map((freq) => (
                        <option key={freq.value} value={freq.value}>
                          {freq.label}
                        </option>
                      ))}
                    </Field>
                  </div>
                  {showEndOptions && (
                    <>
                      <div className="mb-4">
                        <label htmlFor="end">End</label>
                        <Field
                          as="select"
                          name="end"
                          onChange={(e: any) => {
                            formikBlockTime.handleChange(e);
                            setShowSpecialEndDate(e.target.value === "special");
                          }}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        >
                          <option value="never">Never</option>
                          <option value="special">On specific date</option>
                        </Field>
                      </div>
                      {showSpecialEndDate && (
                        <div className="mb-4">
                          <Field
                            type="date"
                            name="special_end_date"
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          />
                        </div>
                      )}
                    </>
                  )}
                  <div className="flex justify-center p-4">
                    <button
                      disabled={isSubmit}
                      type="submit"
                      className="inline-flex items-center justify-center rounded-md bg-primary px-10 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                    >
                      Save
                      {isSubmit && <Spinner />}{" "}
                    </button>
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
                              // onClick={() =>
                              //   handleEditService(detail?.serviceOptionId)
                              // }
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
                    className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-black px-10 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                  >
                    {isSubmit && <Spinner />}
                    Continue to payment
                  </button>
                ) : (
                  <button
                    disabled={isSubmit || formik.values.paymentMethod == ""}
                    type="button"
                    onClick={handlePay}
                    className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-black px-10 py-2 text-center font-medium text-white hover:bg-opacity-90 disabled:bg-gray lg:px-8 xl:px-10"
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
      <Drawer
        className="w-[30%]"
        open={isUpdateAssistant}
        onClose={onCloseEditService}
        position="right"
        backdrop={false}
      >
        <Drawer.Header titleIcon={() => <></>} closeIcon={FaArrowRight} />
        <Drawer.Items>
          <div className="px-6.5">
            <h3 className="mb-4 text-2xl font-bold	text-black">Edit service</h3>
            <div className="mb-4">
              <label className="text-md mb-3 block font-medium text-black dark:text-white">
                Price
              </label>
              <input
                type="text"
                name="price"
                value={bookingDetail?.price}
                onChange={handleInputChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-1.5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                placeholder="Nhập giá tiền"
              />
            </div>
            <div className="mb-4">
              <label className="text-md mb-3 block font-medium text-black dark:text-white">
                Team member
              </label>
              <select
                value={bookingDetail?.assistant?.id}
                onChange={handleAssistantChange}
                className="mt-1 w-full rounded border border-gray-300 p-2"
              >
                {resources.map((resource) => (
                  <option key={resource.id} value={resource.id}>
                    {resource.title}
                  </option>
                ))}
                {/* Thêm các tùy chọn khác ở đây */}
              </select>
            </div>
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/5">
                <button
                  type="button"
                  onClick={() =>
                    handleRemoveServiceOptionDetail(
                      bookingDetail?.serviceOptionId,
                    )
                  }
                  className="inline-flex w-full justify-center rounded border border-gray-300 bg-transparent px-4 py-2 text-white hover:bg-gray"
                >
                  <BsTrash size={25} className="text-red" />
                </button>
              </div>
              <div className="w-full xl:w-4/5">
                <button
                  type="button"
                  onClick={handleUpdateAssistant}
                  className="w-full rounded bg-black px-4 py-2 text-white hover:bg-blue-700"
                >
                  Apply
                </button>
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
