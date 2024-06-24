'use client'
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useEffect, useState } from "react";
import DialogAddService from "../DialogAddService/DialogAddService";
import { customersList } from "@/services/customer.service";
import Select from "react-tailwindcss-select";
import { Form, Formik } from "formik";
import { AppointmentAddForm } from "@/types/AppointmentAddForm";
import {
  getAppointmentShow,
  getListAppointmentCustomer,
  appointmentsPost,
} from "@/services/appointment.service";
import { getServiceOptionShow } from "@/services/serviceoption.service";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
// import { count } from "console";
// import Link from "next/link";
// import AppointmentAddAssistant from "../AddAssistant";

// interface CustomerOption {
//   value: number;
//   label: string;
// }
const CreatedAppointment = Yup.object().shape({
  customer_id: Yup.string().required("Customer ID is required").nullable(),
});

const ApointmentAdd = () => {
  const [customerData, setCustomerData] = useState<
    { id: number; name: string }[]
  >([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [appointments, setListAppointment] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const [appointment, setAppointment] = useState<any | null>(null);
  const [serviceOptions, setServiceOptions] = useState<any[]>([]);
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
      // if (dataListAppointment.data.listAppointment.length === 0) {
      //   setServiceOptions([]);
      // }
    } catch (error) {
      console.error("Error fetching appointment data:", error);
    }
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

  // console.log(appointment);
  const handleServiceOptionSelect = async (id: any) => {
    // setSelectedServiceOptionId(id);
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
            validationSchema={CreatedAppointment}
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
              console.log(values);
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
            {({ errors, touched }) => (
              <Form>
                {/* <!-- Profile Form --> */}
                <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                  <div className="px-6.5 py-4">
                    <h3 className="font-medium text-black dark:text-white">
                      Select Client
                    </h3>
                  </div>
                  <div className="flex items-center rounded bg-white px-4 py-2">
                    <svg
                      className="text-gray-500 mr-2 h-7 w-7"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-4.878-4.878M15 10.5a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
                      ></path>
                    </svg>
                    <Select
                      value={selectedCustomer}
                      onChange={handleChange}
                      options={customerData?.map((customer) => ({
                        value: String(customer?.id),
                        label: customer?.name,
                      }))}
                      isSearchable={true}
                      placeholder="Search..."
                      primaryColor={""}
                    />
                    {errors.customer_id && touched.customer_id && (
                      <div className="w-full text-rose-500">
                        {errors.customer_id}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-6 overflow-x-auto px-6.5 py-4">
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
                  </div>
                  <div className="px-6.5 py-4">
                    <h3 className="font-medium text-black dark:text-white">
                      Services
                    </h3>
                    {serviceOptions.length > 0 ? (
                      serviceOptions.map((detail: any, index: number) => (
                        <div
                          className="service relative mt-3 w-full"
                          key={index}
                        >
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
                                <button className="hover:text-primary">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="h-6 w-6"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                    />
                                  </svg>
                                </button>
                                <button className="hover:text-primary">
                                  <svg
                                    className="fill-current"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 18 18"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    onClick={() =>
                                      handleRemoveServiceOption(detail.id)
                                    }
                                  >
                                    <path
                                      d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                                      fill=""
                                    />
                                    <path
                                      d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                                      fill=""
                                    />
                                    <path
                                      d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                                      fill=""
                                    />
                                    <path
                                      d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                                      fill=""
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No services available</p>
                    )}
                  </div>
                  <div className="flex justify-center px-6.5 py-4">
                    <button
                      type="button"
                      className="hover:bg-gray-200 w-full justify-center rounded-md border-2 border-black bg-white p-3 font-medium text-black sm:w-auto"
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
                      <button className="w-full justify-center rounded bg-slate-900 p-3 font-medium text-gray hover:bg-opacity-90 sm:w-auto">
                        Cancel
                      </button>
                    </div>
                    <div className="flex w-full justify-center xl:w-1/2">
                      <button className="w-full justify-center rounded bg-green-600 p-3 font-medium text-gray hover:bg-opacity-90 sm:w-auto">
                        Save
                      </button>
                    </div>
                  </div>
                </div>
                {/* Additional info */}
              </Form>
            )}
          </Formik>
          <ToastContainer />
        </div>
      </div>
    </>
  );
};
export default ApointmentAdd;
