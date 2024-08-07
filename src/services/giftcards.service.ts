import { giftCardsType } from "@/types/giftCards";
import { http } from "../lib/http";

export const getGiftCard = async (): Promise<any> => {
  return await http.get<any>("giftcards");
};

export const editGiftCard = async (values: giftCardsType): Promise<any> => {
  return await http.post<any>("/gift-card/edit", values);
};