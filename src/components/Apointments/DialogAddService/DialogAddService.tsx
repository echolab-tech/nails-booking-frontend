import { serviceOption } from "@/services/serviceoption.service";
import { Modal, TextInput } from "flowbite-react";
import React, { useCallback, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


interface DialogAddServiceProps {
  onClose: () => void;
  show: boolean;
  onServiceOptionSelect: (id: string) => void;
}

interface SearchServiceOptionValues {
  name_service_option: string;
}

const DialogAddService: React.FC<DialogAddServiceProps> = (props) => {
  const [serviceOptions, setServiceOptions] = useState<any[]>([]);
  const [searchServiceOptionValues, setSearchServiceOptionValues] =
    useState<SearchServiceOptionValues>({
      name_service_option: "",
  });

  useEffect(() => {
    fetchServiceOption();
  }, []);
  const fetchServiceOption = async () => {
    try {
      const response = await serviceOption(searchServiceOptionValues);
      setServiceOptions(response.data.serviceOption);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const handleSearch = async () => {
    fetchServiceOption();
  };
  const handleChangeSearchValues = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchServiceOptionValues({
      ...searchServiceOptionValues,
      [e.target.name]: e.target.value,
    });
  };
  const handleServiceOptionClick = (id: string) => {
    props.onServiceOptionSelect(id);
  };
  return (
    <Modal
      show={props.show}
      size="md"
      popup
      onClose={props.onClose}
      className="z-1"
    >
      <div className="border-2 border-black">
        <Modal.Header>
          <div className="text-gray-900 text-xl font-medium dark:text-white ">
            Add a service
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="flex items-center rounded bg-white px-4 py-2">
            <svg
              className="text-gray-500 mr-2 h-7 w-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              onClick={handleSearch}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.878-4.878M15 10.5a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
              ></path>
            </svg>
            <input
              type="text"
              placeholder="Search client"
              className="w-full focus:outline-none"
              name="name_service_option"
              value={searchServiceOptionValues.name_service_option}
              onChange={handleChangeSearchValues}
            />
          </div>
          <h3 className="mt-3 font-medium text-black dark:text-white">
            Nails ({serviceOptions.length})
          </h3>
          <div className="space-y-6">
            {serviceOptions.length > 0 ? (
              serviceOptions.map((serviceOption, index) => (
                <button
                  className="service relative mt-3 w-full text-left"
                  key={index}
                  onClick={() => handleServiceOptionClick(serviceOption.id)}
                >
                  <div className="absolute bottom-0 left-0 top-0 w-1 bg-blue-500"></div>
                  <div className="flex flex-1 px-6.5 py-4">
                    <div className="w-full xl:w-3/4">
                      <label className="mb-3 ml-3 block text-sm font-medium text-black dark:text-white">
                        {serviceOption.name}
                      </label>
                      <div className="flex items-center">
                        <span>{serviceOption.time}min</span>
                        {/* <span className="ml-5">
                          {serviceOption.assistant.name}
                        </span> */}
                      </div>
                    </div>
                    <div className="w-full xl:w-1/4">
                      <label className="mb-3 block flex justify-end text-sm font-medium text-black dark:text-white">
                        ${serviceOption.price}
                      </label>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <p>No service option available</p>
            )}
            {/* <div className="service relative mt-3 w-full">
              <div className="absolute bottom-0 left-0 top-0 w-1 bg-blue-500"></div>
              <div className="flex flex-1 px-6.5 py-4">
                <div className="w-full xl:w-3/4">
                  <label className="mb-3 ml-3 block text-sm font-medium text-black dark:text-white">
                    Gel medicure
                  </label>
                  <div className="flex items-center">
                    <span className="ml-3">11:45</span>
                    <span className="m-1">-</span>
                    <span>45min</span>
                  </div>
                </div>
                <div className="w-full xl:w-1/4">
                  <label className="mb-3 block flex justify-end text-sm font-medium text-black dark:text-white">
                    $55
                  </label>
                </div>
              </div>
            </div>
            <div className="service relative mt-3 w-full">
              <div className="absolute bottom-0 left-0 top-0 w-1 bg-blue-500"></div>
              <div className="flex flex-1 px-6.5 py-4">
                <div className="w-full xl:w-3/4">
                  <label className="mb-3 ml-3 block text-sm font-medium text-black dark:text-white">
                    Gel medicure
                  </label>
                  <div className="flex items-center">
                    <span className="ml-3">11:45</span>
                    <span className="m-1">-</span>
                    <span>45min</span>
                  </div>
                </div>
                <div className="w-full xl:w-1/4">
                  <label className="mb-3 block flex justify-end text-sm font-medium text-black dark:text-white">
                    $55
                  </label>
                </div>
              </div>
            </div> */}
            <div className="py-4">
              <label className="mb-3 ml-3 block text-sm font-medium text-black dark:text-white">
                Menicure (8)
              </label>
            </div>
            {/* <div className="mb-4.5 flex justify-center">
              <button
                type="submit"
                className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
              >
                Update
              </button>
            </div> */}
          </div>
        </Modal.Body>
      </div>
    </Modal>
  );
};

export default DialogAddService;
