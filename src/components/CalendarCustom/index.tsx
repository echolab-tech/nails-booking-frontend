"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import FullCalendar from "@fullcalendar/react";
import { LuCalendar } from "react-icons/lu";
import { LuCalendarX2 } from "react-icons/lu";
import { BiTransfer } from "react-icons/bi";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import scrollGridPlugin from "@fullcalendar/scrollgrid";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import { getAllAssistants } from "@/services/assistants.service";
import { ResourceType } from "@/types/assistant";
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
import { Form, FormikProvider, useFormik, Field } from "formik";
import {
  appointmentsPost,
  getAppointmentByDate,
  getAppointmentById,
} from "@/services/appointment.service";
import { toast, ToastContainer } from "react-toastify";
import { BlockTimeType } from "@/types/BlockTime";
import { addBlockedTime, getBlockType } from "@/services/blocktime.service";

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
  { value: "2", label: "Every Date" },
  { value: "3", label: "Every Week" },
  { value: "4", label: "Every Year" },
];

interface SearchServiceOptionValues {
  name_service_option: string;
}

const FullCalenDarCustom: React.FC<any> = () => {
  const [resources, setResources] = useState<ResourceType[]>([]);
  const [assistantId, setAssistantId] = useState<string>("");
  const [dateTime, setDateTime] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [blockType, setBlockType] = useState<
    { id: number; name_block_type: string }[]
  >([]);
  const [openSelect, setOpenSelect] = useState<boolean>(false);
  const [openBooking, setOpenBooking] = useState<boolean>(false);
  const [openBlockTime, setOpenBlockTime] = useState<boolean>(false);
  const [isSelectService, setIsSelectService] = useState<boolean>(false);
  const [isShowSelected, setIsShowSelected] = useState<boolean>(true);
  const [events, setEvents] = useState<EventType[]>([]);
  const [lastEventId, setLastEventId] = useState<string | null>(null);
  const [eventId, setEventId] = useState<number | null>(null);
  const [serviceOptions, setServiceOptions] = useState<any[]>([]);
  const [customerData, setCustomerData] = useState<CustomerType[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<boolean>(false);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [searchServiceOptionValues, setSearchServiceOptionValues] =
    useState<SearchServiceOptionValues>({
      name_service_option: "",
    });
  useEffect(() => {
    fetchAppointments();
    fetchService();
    fetchCustomer();
    fetchServiceOption();
    fetchDataBlockType();
  }, []);

  const handleDateClick = (arg: any) => {
    setDateTime(arg.dateStr);
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

  const fetchDataBlockType = async () => {
    const blockType = await getBlockType();
    // setBlockType(blockType.data.dataBlockType);
    setBlockType([
      { id: 1, name_block_type: "Lunch" },
      { id: 2, name_block_type: "Meeting" },
      { id: 3, name_block_type: "Training" },
    ]);
  };

  const handleEventClick = (arg: any) => {
    getAppointmentById(arg?.event?.extendedProps?.booking_id).then((result) => {
      console.log(result?.data?.data?.bookingDetails);

      formik.setValues({
        ...formik.values,
        customer: result?.data?.data?.customer,
        services: result?.data?.data?.bookingDetails,
      });
      setSelectedCustomer(true);
    });
    setAssistantId(arg?.event?.extendedProps?.assistant?.id);
    setEventId(arg?.event?.extendedProps?.booking_id);
    setOpenBooking(true);
    setIsSelectService(false);
    setIsShowSelected(true);
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
    const startDate = new Date(strDate);
    const hours = startDate.getHours();
    const minutes = startDate.getMinutes();

    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}`;
  };

  const formatDateTime = (dateTime: string) => {
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
    setIsShowSelected(true);
  };

  const onCloseModalBlockTime = () => {
    if (lastEventId) {
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== lastEventId),
      );
      setLastEventId(null);
    }
    setOpenBlockTime(false);
    setIsShowSelected(true);
  };

  const handleDrop = (info: any) => {
    console.log(info.event);
  };

  const handleShowService = () => {
    setIsShowSelected(false);
    setIsSelectService(true);
  };

  const handleOpenBooking = () => {
    setOpenSelect(false);
    setOpenBooking(true);
  };

  const handleOpenBlockTime = () => {
    setOpenSelect(false);
    setOpenBlockTime(true);
  };

  const handleServiceOptionSelect = async (id: any) => {
    try {
      const result = await getServiceOptionShow(id, assistantId);
      const { service_id, title, price, time, assistant } = result.data.data;

      const existingOption = formik.values.services.find(
        (option) => option.serviceId === service_id,
      );

      // Nếu dịch vụ đã tồn tại, không thêm lại
      if (existingOption) return;

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
        service_id,
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
      formik.setFieldValue("services", updatedServices);

      setIsShowSelected(true);
      setIsSelectService(false);

      console.log(formik.values.services);
    } catch (error) {
      console.error("Error fetching service option details:", error);
    }
  };

  const handleRemoveServiceOption = (id: string) => {
    const updatedServiceOptions = formik.values.services.filter(
      (option) => option.id !== id,
    );
    formik.setFieldValue("services", updatedServiceOptions);
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

  const formik = useFormik<BookingFormType>({
    initialValues: {
      customer: null,
      services: [],
    },
    onSubmit: async (values) => {
      setIsSubmit(true);
      appointmentsPost(values)
        .then((data) => {
          setIsSubmit(false);
          setOpenBooking(false);
          fetchAppointments();
          setSelectedCustomer(false);
          formik.resetForm();
          toast.success("Appointment created");
        })
        .catch((e) => {
          setIsSubmit(false);
          toast.error(e);
        });
    },
    enableReinitialize: true,
  });

  const formikBlockTime = useFormik<BlockTimeType>({
    initialValues: {
      assistant_id: assistantId,
      reason: "",
      block_type: "1",
      date: formatDateTime(dateTime),
      start_time: formatHoursMinute(startTime),
      end_time: formatHoursMinute(endTime),
      frequency: "1",
      title: "",
    },
    onSubmit: async (values) => {
      setIsSubmit(true);
      addBlockedTime(values)
        .then((data) => {
          setIsSubmit(false);
          setOpenBlockTime(false);
          formikBlockTime.resetForm();
          toast.success("Block time created");
        })
        .catch((e) => {
          setIsSubmit(false);
          toast.error(e);
        });
    },
    enableReinitialize: true,
  });

  const handleBlockTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    formikBlockTime.setFieldValue("block_type", event.target.value);
  };

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

  const businessHours = resources.flatMap((resource) =>
    resource.businessHours.map((bh) => ({
      daysOfWeek: bh.daysOfWeek,
      startTime: bh.startTime,
      endTime: bh.endTime,
    })),
  );

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
        dateClick={handleDateClick}
        select={handleSelectDate}
        eventResize={handleResize}
        eventDrop={handleDrop}
        dayMinWidth={200}
        resourceLabelContent={renderResourceLabelContent}
        businessHours={businessHours}
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
        className="w-[50%] shadow-2xl"
        open={openBooking}
        onClose={onCloseModalBooking}
        position="right"
        backdrop={false}
      >
        <Drawer.Header titleIcon={() => <></>} title={`${startTime}`} />
        <Drawer.Items>
          <FormikProvider value={formik}>
            <Form>
              <div className="flex h-screen">
                <div className="w-[40%] overflow-auto">
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
                <div className="w-[60%]">
                  {isSelectService && (
                    <div className="h-[85%] px-6.5">
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
                  {isShowSelected && (
                    <>
                      <div className="h-[75%] px-6.5">
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
                                        className="hover:text-primary"
                                        onClick={() =>
                                          handleRemoveServiceOption(detail.id)
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
                      <div className="flex justify-center px-6.5 py-4">
                        <button
                          onClick={handleShowService}
                          type="button"
                          className="border-gray-300 hover:bg-gray-100 focus:ring-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 mb-2 me-2 rounded-full border bg-white px-5 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 dark:text-white"
                        >
                          Add Service
                        </button>
                      </div>
                    </>
                  )}
                  <div className="flex px-6.5">
                    <button
                      disabled={isSubmit}
                      type="submit"
                      className="inline-flex items-center justify-center rounded-md bg-primary px-10 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                    >
                      Save
                      {isSubmit && <Spinner />}
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          </FormikProvider>
        </Drawer.Items>
      </Drawer>
      <Drawer
        className="p- flex h-full w-[50%] flex-col p-6"
        open={openBlockTime}
        onClose={onCloseModalBlockTime}
        position="right"
        backdrop={false}
      >
        <Drawer.Header titleIcon={() => <></>} title="Add blocked time" />
        <Drawer.Items>
          <FormikProvider value={formikBlockTime}>
            <Form>
              <div className="flex h-screen">
                <div className="w-full overflow-auto">
                  <div className="mb-4">
                    <label htmlFor="blockType">Block type</label>
                    <Field
                      as="select"
                      type="text"
                      name="block_type"
                      onChange={handleBlockTypeChange}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    >
                      {blockType.map((block) => (
                        <option key={block.id} value={block.id}>
                          {block.name_block_type}
                        </option>
                      ))}
                    </Field>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="title">Title</label>
                    <Field
                      type="text"
                      name="title"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="reason">Reason</label>
                    <Field
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
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    >
                      {frequencyOptions.map((freq) => (
                        <option key={freq.value} value={freq.value}>
                          {freq.label}
                        </option>
                      ))}
                    </Field>
                  </div>
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
      <ToastContainer />
    </>
  );
};

export default FullCalenDarCustom;
