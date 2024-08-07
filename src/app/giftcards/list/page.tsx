import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import GiftCardsList from "@/components/GiftCards/GiftCards";

export const metadata: Metadata = {
  title: "Giftcards list | NailsAdmin Template",
  description: "This is Giftcards list page for NailsAdmin Template",
};

const GiftCardsListPage = () => {
  return (
    <DefaultLayout>
      <GiftCardsList />
    </DefaultLayout>
  );
};

export default GiftCardsListPage;
