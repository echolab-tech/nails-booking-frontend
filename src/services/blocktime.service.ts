import { http } from "../lib/http";
import { BlockTimeType } from "@/types/BlockTime";

export const addBlockedTime = async (values: BlockTimeType): Promise<any> => {
  return await http.post<any>("/block-times", values);
};

export const getBlockType = async (): Promise<any> => {
  return await http.get<any>("/block-type");
};

export const getBlockTimes = async (): Promise<any> => {
  return await http.get<any>("/block-times");
};
