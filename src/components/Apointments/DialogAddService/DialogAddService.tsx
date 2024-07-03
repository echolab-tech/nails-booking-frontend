import Spinner from "@/components/common/Spinner";
import { serviceOption } from "@/services/serviceoption.service";
import { ServiceOptionType } from "@/types/ServiceOption";
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
  const [serviceOptions, setServiceOptions] = useState<ServiceOptionType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
      setIsLoading(false);
      setServiceOptions(response.data.data);
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
      size="xl"
      popup
      onClose={props.onClose}
      className="z-1"
    >
      <Modal.Header>
        <div className="text-xl font-medium text-gray-900 dark:text-white ">
          Add a service
        </div>
      </Modal.Header>
      <Modal.Body className="max-h-[550px]">
        <form className="w-full">
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
              className="border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 block w-full rounded-lg border p-4 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="Search service name"
              required
            />
          </div>
        </form>

        {isLoading ? (
          <Spinner />
        ) : (
          serviceOptions?.map((item, index) => (
            <div key={index}>
              <h3 className="mt-3 font-medium text-black dark:text-white">
                {item?.category_name} ({item?.count})
              </h3>
              <div className="space-y-6">
                {item?.service_options.length > 0 &&
                  item?.service_options.map((option, index) => (
                    <button
                      className="service relative mt-3 w-full text-left"
                      key={index}
                      onClick={() => handleServiceOptionClick(option?.id)}
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
                  ))}
              </div>
            </div>
          ))
        )}
      </Modal.Body>
    </Modal>
  );
};

export default DialogAddService;
