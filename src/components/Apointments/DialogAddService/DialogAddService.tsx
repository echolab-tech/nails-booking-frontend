import { serviceOption } from "@/services/serviceoption.service";
import { Modal } from "flowbite-react";
import React, { useEffect, useState } from "react";

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
      console.error("Error fetching service options:", error);
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
    // console.log(id);
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
          <div className="text-xl font-medium text-gray-900 dark:text-white">
            Add a service
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="flex items-center rounded bg-white px-4 py-2">
            <svg
              className="text-gray-500 mr-2 h-7 w-7 cursor-pointer"
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
              placeholder="Search service"
              className="w-full focus:outline-none"
              name="name_service_option"
              value={searchServiceOptionValues.name_service_option}
              onChange={handleChangeSearchValues}
            />
          </div>
          <div className="mt-4 space-y-6">
            {serviceOptions.length > 0 ? (
              serviceOptions.map((category: any, index: number) => (
                <div key={index}>
                  <h3 className="mt-3 font-medium text-black dark:text-white">
                    {category.name} ({category.countServiceOption})
                  </h3>
                  {category.services.length > 0 ? (
                    category.services.map(
                      (service: any, serviceIndex: number) =>
                        service.service_options.length > 0 ? (
                          service.service_options.map(
                            (serviceOption: any, optionIndex: number) => (
                              <button
                                type="button"
                                className="service relative mt-3 w-full text-left"
                                key={optionIndex}
                                onClick={() =>
                                  handleServiceOptionClick(serviceOption.id)
                                }
                              >
                                <div className="absolute bottom-0 left-0 top-0 w-1 bg-blue-500"></div>
                                <div className="flex flex-1 px-6.5 py-4">
                                  <div className="w-full xl:w-3/4">
                                    <label className="mb-3 ml-3 block text-sm font-medium text-black dark:text-white">
                                      {serviceOption.name}
                                    </label>
                                    <div className="flex items-center">
                                      <span>{serviceOption.time} min</span>
                                      {/* Uncomment if assistant.name is needed */}
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
                            ),
                          )
                        ) : (
                          <p className="mt-3">No service available</p>
                        ),
                    )
                  ) : (
                    <p className="mt-3">No service available</p>
                  )}
                </div>
              ))
            ) : (
              <p>No service available</p>
            )}
          </div>
        </Modal.Body>
      </div>
    </Modal>
  );
};

export default DialogAddService;
