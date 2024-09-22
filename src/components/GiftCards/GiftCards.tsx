"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getGiftCard, editGiftCard } from "@/services/giftcards.service";
import { Card } from "flowbite-react";
import { CiGift } from "react-icons/ci";
import { giftCardsType } from "@/types/giftCards";

const GiftCardsList = () => {
  const router = useRouter();
  const [availability, setAvailability] = useState("");
  const [giftCard, setGiftCard] = useState<giftCardsType>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGiftCardData = async () => {
      try {
        const response = await getGiftCard();
        setAvailability(
          response?.data?.data?.status === 1
            ? "In-store only"
            : "Online and in-store",
        );
        setGiftCard(response?.data?.data);
      } catch (error) {
        console.error("Failed to fetch gift card data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGiftCardData();
  }, []);

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto px-4">
      <h2 className="mb-4 text-2xl font-semibold text-black dark:text-white">
        Gift cards
      </h2>
      <p className="mb-8 text-black dark:text-white">
        Choose how you would like to sell your gift cards, and customise their
        settings.
      </p>
      {giftCard?.status ? (
        <div className="mb-4 rounded-xl border border-gray-200 p-4">
          <div className="mb-3.5 grid grid-cols-2 gap-4">
            <div>
              <p className="font-bold text-black dark:text-white">
                Availability and values
              </p>
              <p className="text-black dark:text-white">
                Choose where you would like to sell your gift cards, set
                expiration and values.
              </p>
            </div>
            <div className="flex items-center justify-around">
              <button className="ml-4 rounded-xl border px-4 py-2 text-black dark:text-white">
                Gift cards sold
              </button>
            </div>
          </div>

          <div className="mb-3.5 grid grid-cols-3 gap-4">
            <div className="flex flex-col">
              <p className="font-bold text-black dark:text-white">
                Available for sale
              </p>
              <p>{availability}</p>
            </div>
            <div className="flex flex-col">
              <p className="font-bold text-black dark:text-white">
                Default expiration
              </p>
              <p className="ml-2">{`${giftCard?.expiration}days`}</p>
            </div>
            <div className="flex items-center">
              <button
                className="ml-4 rounded-xl border px-4 py-2 text-black dark:text-white"
                onClick={() => router.push("/giftcards/edit")}
              >
                Edit
              </button>
            </div>
          </div>

          <div>
            <p className="font-bold text-black dark:text-white">
              Gift card values
            </p>
            <div className="flex flex-wrap gap-2">
              {giftCard?.values
                ?.filter((value) => value !== null && value !== undefined) // Lọc các giá trị null và undefined
                .map((value, index) => (
                  <div key={index}>{formatPrice(Number(value))}</div>
                ))}
            </div>
          </div>
        </div>
      ) : (
        <Card className="w-full">
          <CiGift size={100} color="blue" />
          <h5 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
            Gift cards inactive
          </h5>
          <p className="text-gray-500 mb-5 text-base dark:text-gray-400 sm:text-lg">
            Let your clients buy personalised gift cards and send to friends &
            family for your business.
          </p>
          <button
            onClick={() => router.push("gift-cards/edit")}
            className="w-[100px] rounded-md bg-black px-6 py-2 text-white"
          >
            Setup
          </button>
        </Card>
      )}
    </div>
  );
};

export default GiftCardsList;
