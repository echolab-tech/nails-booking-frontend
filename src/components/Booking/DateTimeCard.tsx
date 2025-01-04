"use client";
import React, { useEffect, useState } from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa6";
import { format, parse } from "date-fns";

const DateTimeCard = ({ date }) => {
  return (
    <div className="flex border border-primary bg-green-50 justify-center items-center p-3 gap-4 rounded-xl mt-4">
      <IoCalendarOutline size={25} className="text-primary" />
      <b className="font-bold">
        {format(parse(date, "dd-MM-yyyy HH:mm", new Date()), "yyyy MMM dd")}
      </b>
      <FaRegClock size={25} className="text-primary" />
      <b className="font-bold">
        {format(parse(date, "dd-MM-yyyy HH:mm", new Date()), "h:mm a")}
      </b>
    </div>
  );
};

export default DateTimeCard;
