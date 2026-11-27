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

// Q5: block lặp → scope "only" xóa riêng lần ở ngày `date` (YYYY-MM-DD), "all" xóa cả chuỗi
export const deleteBlockTime = async (
  id: string | number,
  scope: "only" | "all" = "all",
  date?: string,
): Promise<any> => {
  const query = scope === "only" && date ? `?scope=only&date=${date}` : "";
  return await http.delete<any>(`/block-times/${id}${query}`);
};
