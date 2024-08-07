"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getGiftCard, editGiftCard } from "@/services/giftcards.service";

const GiftCardsList = () => {
  const router = useRouter();
  const [availability, setAvailability] = useState("");
  const [expiration, setExpiration] = useState("");
  const [values, setValues] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGiftCardData = async () => {
      try {
        const response = await getGiftCard();
        const giftCardData = response.data[0];
        setAvailability(
          giftCardData.status === 1 ? "In-store only" : "Online and in-store",
        );
        setExpiration(`${giftCardData.expiration} days`);
        setValues(giftCardData.allValues);
      } catch (error) {
        console.error("Failed to fetch gift card data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGiftCardData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto px-4">
      <h2 className="mb-4 text-2xl font-semibold">Gift cards</h2>
      <p className="text-gray-600 mb-8">
        Choose how you would like to sell your gift cards, and customise their
        settings.
      </p>

      <div className="border-gray-200 mb-4 rounded-xl border p-4">
        <div className="mb-3.5 grid grid-cols-2 gap-4">
          <div>
            <p className="font-bold">Availability and values</p>
            <p>
              Choose where you would like to sell your gift cards, set
              expiration and values.
            </p>
          </div>
          <div className="flex items-center justify-around">
            <button className="ml-4 rounded-xl border px-4 py-2 text-black">
              Gift cards sold
            </button>
          </div>
        </div>

        <div className="mb-3.5 grid grid-cols-3 gap-4">
          <div className="flex flex-col">
            <p className="font-bold">Available for sale</p>
            <p>{availability}</p>
          </div>
          <div className="flex flex-col">
            <p className="font-bold">Default expiration</p>
            <p className="ml-2">{expiration}</p>
          </div>
          <div className="flex items-center">
            <button
              className="ml-4 rounded-xl border px-4 py-2 text-black"
              onClick={() => router.push("/giftcards/edit")}
            >
              Edit
            </button>
          </div>
        </div>

        <div>
          <p className="font-bold">Gift card values</p>
          <div className="flex flex-wrap gap-2">
            {values?.map((value, index) => (
              <div key={index} className="bg-gray-100 rounded">
                ₫{value}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftCardsList;
