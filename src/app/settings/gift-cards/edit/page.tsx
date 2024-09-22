import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import GiftCardsEdit from "@/components/GiftCards/Edit/GiftCardsEdit";

export const metadata: Metadata = {
  title: "Giftcards edit | NailsAdmin Template",
  description: "This is Giftcards edit page for NailsAdmin Template",
};

const GiftCardsEditPage = () => {
  return (
    <DefaultLayout>
      <GiftCardsEdit />
    </DefaultLayout>
  );
};

export default GiftCardsEditPage;
