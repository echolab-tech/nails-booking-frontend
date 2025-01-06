"use client";
import React, { useEffect, useState } from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa6";
import { format, parse } from "date-fns";

const DateTimeCard = ({ date }) => {
  return (
    <div className="mt-4 flex items-center justify-center gap-4 rounded-xl border border-primary bg-green-50 p-3">
      <IoCalendarOutline size={25} className="text-primary" />
      <b className="font-bold">
        {/* {format(parse(date, "dd-MM-yyyy HH:mm", new Date()), "yyyy MMM dd")} */}
      </b>
      <FaRegClock size={25} className="text-primary" />
      <b className="font-bold">
        {/* {format(parse(date, "dd-MM-yyyy HH:mm", new Date()), "h:mm a")} */}
      </b>
    </div>
  );
};

export default DateTimeCard;
