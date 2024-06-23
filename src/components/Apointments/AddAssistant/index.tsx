import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useEffect, useState } from "react";
const AppointmentAddAssistant = () => {
  const [dataAssitant, setDataAssistant] = useState<any>(null);
  // useEffect(() => {
  //   fetchAssistant();
  // }, []);
  //  const fetchAssistant = async () => {
  //    try {
  //      const response = await customersList();
  //      setDataAssistant(response.data.data);
  //    } catch (error) {
  //      console.error("Error fetching categories:", error);
  //    }
  //  };
  return (
    <>
      <Breadcrumb pageName="Add Assistant" />
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          <form>
            <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="px-6.5 py-4">
                <h3 className="font-medium text-black dark:text-white">
                  Select Assistant
                </h3>
              </div>
              <div className="px-6.5 py-4">

              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AppointmentAddAssistant;
