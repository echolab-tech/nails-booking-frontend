import React, { useEffect, useState } from "react";
import { getTopServices } from "@/services/dashboard.service"; // Import service call
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TopServicesList = () => {
  const [topServicesData, setTopServicesData] = useState<any[]>([]);

  useEffect(() => {
    fetchTopServices();
  }, []);

  const fetchTopServices = async () => {
    try {
      const response = await getTopServices();
      setTopServicesData(response.data.data);
    } catch (error) {
      console.error("Error fetching top services:", error);
      toast.error("Error fetching top services");
    }
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-6">
      <div className="max-w-full overflow-x-auto">
        <p className="pb-4 text-xl font-semibold text-black">Top services</p>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                Service Name
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                This Month
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Last Month
              </th>
            </tr>
          </thead>
          <tbody>
            {topServicesData.map((service, index) => (
              <tr key={index}>
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {service.name}
                  </h5>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  {service.currentMonthServices}
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  {service.last_month}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ToastContainer />
      </div>
    </div>
  );
};

export default TopServicesList;
