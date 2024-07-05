import { ApexOptions } from "apexcharts";
import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { getLast7Days } from "../utils/getLast7Days";
import { TypeRecentsale } from "@/types/dashboard";
import { getRecentsales } from "@/services/dashboard.service";

const ChartRecentSale: React.FC = () => {
  const [state, setState] = useState<ChartRecentSaleState>({
    series: [
      {
        name: "Product One",
        data: [],
      },
    ],
  });

  const [serviceData, setServiceData] = useState<TypeRecentsale[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [totalBooking, setTotalBooking] = useState<number>(0);
  const [formattedDates, setFormattedDates] = useState<string[]>([]);

  useEffect(() => {
    const fetchRecentsales = async () => {
      try {
        const response = await getRecentsales(true);
        setServiceData(response.data.daily_bookings);
        setTotalAmount(Number(response.data.total_amount));
        setTotalBooking(Number(response.data.total_bookings));
      } catch (error) {
        console.error("Error fetching recent sales: ", error);
      }
    };

    fetchRecentsales();
  }, []);

  useEffect(() => {
    const last7Days = getLast7Days();

    const datesFormatted = last7Days.map((dateString) => {
      const date = new Date(dateString);
      const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" });
      const dayOfMonth = date.getDate();
      return { formatted: `${dayOfWeek} ${dayOfMonth}`, date: date };
    });
    datesFormatted.sort((a, b) => a.date.getTime() - b.date.getTime());
    setFormattedDates(datesFormatted.map((item) => item.formatted));
  }, [serviceData]);

  useEffect(() => {
    const last7Days = getLast7Days();
    const dateCountMap = new Map();
    serviceData.forEach((item) => {
      dateCountMap.set(item.date, item.count);
    });

    const seriesData = last7Days.map((day) => {
      console.log("day:", day);
      const [dayName, dayDate] = day.split(" ");
      return dateCountMap.get(dayName) || 0;
    });

    setState({
      series: [
        {
          name: "Product One",
          data: seriesData,
        },
      ],
    });
  }, [serviceData]);

  const handleReset = () => {
    setState((prevState) => ({
      ...prevState,
    }));
  };
  handleReset;

  const options: ApexOptions = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#3C50E0", "#80CAEE"],
    chart: {
      fontFamily: "Satoshi, sans-serif",
      height: 335,
      type: "area",
      dropShadow: {
        enabled: true,
        color: "#623CEA14",
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },
      toolbar: {
        show: false,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 350,
          },
        },
      },
    ],
    stroke: {
      width: [2, 2],
      curve: "straight",
    },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
        opacity: 0.5,
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 4,
      colors: "#fff",
      strokeColors: ["#3056D3", "#80CAEE"],
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      hover: {
        size: undefined,
        sizeOffset: 5,
      },
    },
    xaxis: {
      type: "category",
      categories: formattedDates,
    },
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-6">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <div className="w-full">
              <p className="py-1 text-xl font-semibold text-black">
                Recent sales
              </p>
              <p className="py-1 text-xs font-medium">Last 7 days</p>
              <p className="py-1 text-xl font-semibold text-black">
                ${totalAmount.toFixed(2)}
              </p>
              <p className="py-1 text-sm font-medium">
                Appointments {totalBooking}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={options}
            series={state.series}
            type="area"
            height={350}
            width={"100%"}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartRecentSale;
