"use client";
import React, { useState, useEffect, useRef } from "react";
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
import { title } from "process";
import { Modal } from "flowbite-react";
import { FaRegPenToSquare } from "react-icons/fa6";
import { BsTrash } from "react-icons/bs";
import { GoInbox } from "react-icons/go";
import { CustomerType } from "@/types/customer";
import { customersList } from "@/services/customer.service";
import { addMinutes } from "date-fns";
import {
  getServiceOptionShow,
  serviceOption,
} from "@/services/serviceoption.service";
import { Form, FormikProvider, useFormik, useFormikContext } from "formik";

interface SearchServiceOptionValues {
  name_service_option: string;
}

const FullCalenDarCustom: React.FC<any> = () => {
  const [resources, setResources] = useState<ResourceType[]>([]);
  const [assistantId, setAssistantId] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [openSelect, setOpenSelect] = useState<boolean>(false);
  const [openBooking, setOpenBooking] = useState<boolean>(false);
  const [isSelectService, setIsSelectService] = useState<boolean>(false);
  const [isShowSelected, setIsShowSelected] = useState<boolean>(true);
  const [events, setEvents] = useState<EventType[]>([]);
  const [lastEventId, setLastEventId] = useState<string | null>(null);
  const [serviceOptions, setServiceOptions] = useState<any[]>([]);
  const [selectServices, setSelectServices] = useState<any[]>([]);
  const [customerData, setCustomerData] = useState<CustomerType[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<boolean>(false);
  const [searchServiceOptionValues, setSearchServiceOptionValues] =
    useState<SearchServiceOptionValues>({
      name_service_option: "",
    });
  useEffect(() => {
    fetchService();
    fetchCustomer();
    fetchServiceOption();
  }, []);

  const handleDateClick = (arg: any) => {
    alert(arg.dateStr);
  };

  const fetchService = async () => {
    getAllAssistants().then((data) => {
      setResources(data?.data?.data);
    });
  };

  const fetchCustomer = async () => {
    try {
      const response = await customersList();
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
    console.log(arg.event.title);
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
  };

  const handleResize = (info: any) => {
    alert(info.event.title + " end is now " + info.event.end.toISOString());

    if (!confirm("is this okay?")) {
      info.revert();
    }
  };

  const formatHoursMinute = (strDate: string) => {
    const startDate = new Date(strDate);
    const hours = startDate.getHours();
    const minutes = startDate.getMinutes();
    return `${hours}:${minutes}`;
  };

  // const formatDateTime = (strDate: string) => {
  //   const startDate = new Date(strDate);
  //   const year = startDate.getFullYear();
  //   const month = startDate.getMonth();
  //   const date = startDate.getDate();
  //   const hours = startDate.getHours();
  //   const minutes = startDate.getMinutes();
  //   return `${date}/${month + 1}/${year} ${hours}:${minutes}`;
  // };

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
    setOpenBooking(false);
    setIsSelectService(false);
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

  const handleServiceOptionSelect = async (id: any) => {
    try {
      const result = await getServiceOptionShow(id, assistantId);
      const {
        id: serviceId,
        service_name,
        price,
        time,
        assistant,
      } = result.data.data;

      const existingOption = formik.values.services.find(
        (option) => option.id === serviceId,
      );

      // Nếu dịch vụ đã tồn tại, không thêm lại
      if (existingOption) return;

      // Nếu không có dịch vụ nào trước đó, sử dụng startTime
      const lastServiceEndTime =
        formik.values.services.length > 0
          ? new Date(
              formik.values.services[formik.values.services.length - 1].end,
            )
          : new Date(startTime);

      // Thời gian bắt đầu của dịch vụ mới là thời gian kết thúc của dịch vụ cuối cùng
      const newStartTime = lastServiceEndTime;
      const newEndTime = addMinutes(newStartTime, time);

      const newService = {
        id: serviceId,
        service_name,
        price,
        time,
        assistant: {
          id: assistant.id,
          name: assistant.name,
        },
        start: newStartTime,
        end: newEndTime,
      };

      // Cập nhật danh sách dịch vụ trong formik
      const updatedServices = [...formik.values.services, newService];
      formik.setFieldValue("services", updatedServices);

      setIsShowSelected(true);
      setIsSelectService(false);
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

  const formik = useFormik<BookingFormType>({
    initialValues: {
      customer: null,
      services: [],
    },
    onSubmit: async (values) => {
      console.log(values);
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
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
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
      <Modal size="4xl" show={openBooking} onClose={onCloseModalBooking}>
        <Modal.Header>
          <h3 className="text-black">{startTime}</h3>
        </Modal.Header>
        <Modal.Body>
          <FormikProvider value={formik}>
            <Form>
              <div className="flex">
                <div className="h-100 w-[30%] overflow-auto">
                  {/* start show info customer */}
                  {!selectedCustomer && (
                    <>
                      <h3 className="font-medium text-black dark:text-white">
                        Select a client
                      </h3>
                      <form className="w-full py-2">
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
                            id="default-search"
                            className="border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 block w-full rounded-lg border p-4 ps-10 text-sm text-gray-900 dark:text-white"
                            placeholder="Search service name"
                          />
                        </div>
                      </form>
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
                <div className="w-[70%]">
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
                                          {option?.service_name}
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
                                      {detail?.service_name}
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
                  <div className="flex">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-md bg-primary px-10 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          </FormikProvider>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default FullCalenDarCustom;
