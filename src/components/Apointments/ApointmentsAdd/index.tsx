"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useEffect, useState } from "react";
import DialogAddService from "../DialogAddService/DialogAddService";
import { customersList } from "@/services/customer.service";
import Select from "react-tailwindcss-select";
import { Form, Formik } from "formik";
import { AppointmentAddForm } from "@/types/AppointmentAddForm";
import { GoInbox } from "react-icons/go";

import {
  getAppointmentShow,
  getListAppointmentCustomer,
  appointmentsPost,
} from "@/services/appointment.service";
import { getServiceOptionShow } from "@/services/serviceoption.service";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CustomerType } from "@/types/customer";
import DialogEditService from "../DialogEditService";
import { BsTrash } from "react-icons/bs";
import { FaRegPenToSquare } from "react-icons/fa6";

const ApointmentAdd = () => {
  const [customerData, setCustomerData] = useState<CustomerType[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [appointments, setListAppointment] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const [appointment, setAppointment] = useState<any | null>(null);
  const [serviceOptions, setServiceOptions] = useState<any[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  // const [selectedServiceOptionId, setSelectedServiceOptionId] = useState(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    number | null
  >(null);

  useEffect(() => {
    fetchCustomer();
  }, []);
  const fetchCustomer = async () => {
    try {
      const response = await customersList();
      setCustomerData(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const handleOpenDialogClick = async () => {
    setIsDialogOpen(true);
  };

  const handleChange = async (value: any) => {
    setSelectedCustomer(value);
    setServiceOptions([]);
    try {
      const dataListAppointment = await getListAppointmentCustomer(value.value);
      setListAppointment(dataListAppointment.data.listAppointment);
    } catch (error) {
      console.error("Error fetching appointment data:", error);
    }
  };

  const onOpenDialogEdit = (id: string) => {
    setIsEdit(true);
  };

  const onCloseDialogEdit = () => {
    setIsEdit(false);
  };

  const handleShowServiceOption = async (id: number) => {
    try {
      if (id !== selectedAppointmentId) {
        setSelectedAppointmentId(id);
        setServiceOptions([]);
      }

      const dataAppointment = await getAppointmentShow(id);
      const newAppointment = dataAppointment.data.data;
      // setAppointment(newAppointment);

      if (newAppointment && newAppointment.bookingDetails) {
        setServiceOptions((prevServiceOptions: any) => {
          const existingServiceOptionIds = new Set(
            prevServiceOptions.map((option: any) => option.id),
          );

          const newServiceOptions = newAppointment.bookingDetails
            .map((detail: any) => detail.service_option)
            .filter((option: any) => !existingServiceOptionIds.has(option.id));

          return [...prevServiceOptions, ...newServiceOptions];
        });
      }
    } catch (error) {
      console.error("Error fetching appointment data:", error);
    }
  };

  const handleServiceOptionSelect = async (id: any) => {
    setIsDialogOpen(false);
    try {
      const dataAppointment = await getServiceOptionShow(id);
      setServiceOptions((prevServiceOptions) => {
        const existingOption = prevServiceOptions.find(
          (option) => option.id === dataAppointment.data.data.id,
        );
        return existingOption
          ? prevServiceOptions
          : [...prevServiceOptions, dataAppointment.data.data];
      });
    } catch (error) {
      console.error("Error fetching service option details:", error);
    }
  };

  const handleRemoveServiceOption = (id: any) => {
    setServiceOptions((prevServiceOptions) => {
      const updatedServiceOptions = prevServiceOptions.filter(
        (option) => option.id !== id,
      );
      return updatedServiceOptions;
    });
  };

  return (
    <>
      <Breadcrumb pageName="Add a new apointments" />
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          <Formik
            enableReinitialize={true}
            initialValues={{
              customer_id: null,
              total_fee: null,
              status: null,
              description_request: "",
              checkout_session_id: "",
              booking_type: null,
              is_group: null,
              total_time: "",
              // start_time: "",
              // end_time: "",
              bookingDetails: null,
            }}
            onSubmit={(values: AppointmentAddForm, { resetForm }) => {
              values.customer_id = parseInt(selectedCustomer?.value);
              const totalPrice = serviceOptions.reduce(
                (accumulator, currentOption) =>
                  accumulator + parseInt(currentOption.price),
                0,
              );

              values.total_fee = totalPrice;
              values.total_time = serviceOptions.reduce(
                (accumulator, currentOption) =>
                  accumulator + parseInt(currentOption.time),
                0,
              );
              // values.start_time = new Date().toISOString();
              // const startTime = new Date(values.start_time);
              // const totalMinutes = serviceOptions.reduce(
              //   (accumulator, currentOption) =>
              //     accumulator + parseInt(currentOption.time),
              //   0,
              // );
              // const endTime = new Date(
              //   startTime.getTime() + totalMinutes * 60000,
              // );
              // const formattedEndTime = endTime.toISOString();
              // values.end_time = formattedEndTime;
              values.bookingDetails = serviceOptions;
              // Gán giá trị cho end_time
              // values.birthday = selectedBirthday;
              appointmentsPost(values)
                .then((data) => {
                  toast.success("you created it successfully.");
                  resetForm();
                })
                .catch((error) => {
                  toast.error("you failed to create a new one.");
                });
            }}
          >
            <Form>
              {/* <!-- Profile Form --> */}
              <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="px-6.5 py-4">
                  <h3 className="font-medium text-black dark:text-white">
                    Select Client
                  </h3>
                </div>
                <div className="flex items-center rounded bg-white px-4 py-2">
                  <Select
                    value={selectedCustomer}
                    onChange={handleChange}
                    options={customerData?.map((customer) => ({
                      value: customer?.id,
                      label: `${customer?.name} (${customer?.phone})`,
                    }))}
                    isSearchable={true}
                    placeholder="Search..."
                    primaryColor={""}
                  />
                </div>
                {/* <div className="flex gap-6 overflow-x-auto px-6.5 py-4">
                    {appointments.length > 0 ? (
                      appointments.map((appointment, index) => (
                        <button
                          type="button"
                          key={index}
                          className="border-gray-1500 hover:border-gray-500 flex rounded-md border focus:border-blue-500 focus:ring focus:ring-blue-200 xl:w-1/2 xl:max-w-none"
                          onClick={() =>
                            handleShowServiceOption(appointment.id)
                          }
                        >
                          <div className="flex flex-1 px-6.5 py-4">
                            <div className="flex w-full flex-col items-start">
                              <label className=" mb-3 block text-sm font-medium text-black dark:text-white">
                                Appointment
                              </label>
                              <div className="d-flex">
                                <span>{appointment.start_time}</span>
                                <div className="flex">
                                  <span>{appointment.total_time}min</span>
                                  <span className="ml-3">
                                    {appointment.customer.name}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex w-full items-center justify-end">
                              <label className="mb-3 ml-3 block text-sm font-medium text-black dark:text-white">
                                ${appointment.total_fee}
                              </label>
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <p>No appointments available</p>
                    )}
                  </div> */}
                <div className="px-6.5 py-4">
                  <h3 className="font-medium text-black dark:text-white">
                    Services
                  </h3>
                  {serviceOptions.length > 0 ? (
                    serviceOptions.map((detail: any, index: number) => (
                      <div className="service relative mt-3 w-full" key={index}>
                        <div className="absolute bottom-0 left-0 top-0 w-1 bg-blue-500"></div>
                        <div className="flex flex-1 px-6.5 py-4">
                          <div className="w-full xl:w-3/4">
                            <label className="mb-3 ml-3 block text-sm font-medium text-black dark:text-white">
                              {detail.name}
                            </label>
                            <div className="flex items-center">
                              <span>
                                Service time: {detail.time}
                                min
                              </span>
                              <span className="m-1">-</span>
                              <span>{detail.assistant.name}</span>
                            </div>
                          </div>
                          <div className="w-full xl:w-1/4">
                            <label className="mb-3 ml-3 block flex justify-end text-sm font-medium text-black dark:text-white">
                              ${detail.price}
                            </label>
                            <div className="flex justify-end space-x-3.5">
                              <button
                                type="button"
                                onClick={() => onOpenDialogEdit(detail?.id)}
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
                                <BsTrash size={25} className="text-black" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex min-h-[200px] flex-col items-center">
                      <GoInbox size={50} />
                      <p>Add a service to save the appointment</p>
                    </div>
                  )}
                </div>
                <div className="flex justify-center px-6.5 py-4">
                  <button
                    type="button"
                    className="border-gray-300 hover:bg-gray-100 focus:ring-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 mb-2 me-2 rounded-full border bg-white px-5 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 dark:text-white"
                    onClick={handleOpenDialogClick}
                  >
                    Add Service
                  </button>
                </div>
                {isDialogOpen && (
                  <DialogAddService
                    onClose={() => setIsDialogOpen(false)}
                    show={isDialogOpen}
                    onServiceOptionSelect={handleServiceOptionSelect}
                  />
                )}
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="flex w-full justify-center xl:w-1/2 ">
                    <button className="w-[120px] justify-center rounded bg-slate-900 p-3 font-medium text-gray hover:bg-opacity-90">
                      Checkout
                    </button>
                  </div>
                  <div className="flex w-full justify-center xl:w-1/2">
                    <button
                      type="button"
                      className="w-[100px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
              {/* Additional info */}
              <DialogEditService
                show={isEdit}
                onClose={onCloseDialogEdit}
                onApply={onCloseDialogEdit}
              />
            </Form>
          </Formik>
          <ToastContainer />
        </div>
      </div>
    </>
  );
};
export default ApointmentAdd;
