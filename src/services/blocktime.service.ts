import { http } from "../lib/http";
import { BlockTimeType } from "@/types/BlockTime";

export const addBlockedTime = async (values: BlockTimeType): Promise<any> => {
  return await http.post<any>("/block-times", values);
};

export const getBlockType = async (): Promise<any> => {
  return await http.get<any>("/block-type");
};

export const getBlockTimes = async (
  start: string,
  end: string,
): Promise<any> => {
  return await http.get<any>(
    `/block-times?start_date=${start}&end_date=${end}`,
  );
};
