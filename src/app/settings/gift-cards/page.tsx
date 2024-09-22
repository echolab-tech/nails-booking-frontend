import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import GiftCardsList from "@/components/GiftCards/GiftCards";

export const metadata: Metadata = {
  title: "Giftcards setting",
  description: "This is Giftcards management",
};

const SettingGiftCards = () => {
  return (
    <DefaultLayout>
      <GiftCardsList />
    </DefaultLayout>
  );
};

export default SettingGiftCards;
