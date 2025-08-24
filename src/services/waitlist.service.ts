import { WaitListType, WaitListCreateRequest } from "@/types/WaitList";
import { http } from "../lib/http";

// 1. API để lấy danh sách waitlist với phân trang và tìm kiếm
export const getListWaitList = async (
  page: number,
  search: any | null,
): Promise<any> => {
  return await http.get<any>(
    `/wait-list?search=${search ? search : ""}&page=${page}`,
  );
};

// POST /wait-list - Tạo mới wait list
export const createWaitList = async (data: WaitListCreateRequest): Promise<WaitListType> => {
  const response = await http.post<WaitListType>("/wait-list", data);
  return response.data;
};
