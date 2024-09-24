import { http } from "../lib/http";
import { ServicePackageForm } from "@/types/service";

// 1. API để lấy danh sách service với phân trang và tìm kiếm
export const getListService = async (
  page: number,
  search: any | null,
): Promise<any> => {
  return await http.get<any>(
    `/services?search=${search ? search : ""}&page=${page}`,
  );
};

// 2. API để thêm một service mới
export const addService = async (values: any): Promise<any> => {
  return await http.post<any>("/services", values);
};

// 3. API để lấy thông tin một service theo ID
export const getService = async (id: string): Promise<any> => {
  return await http.get<any>(`/services/${id}`);
};

// 4. API để cập nhật một service theo ID
export const updateService = async (id: string, data: any): Promise<any> => {
  return await http.put<any>(`/services/${id}`, data);
};

// 5. API để xóa một service
export const deleteService = async (
  id: string,
  confirm: boolean,
): Promise<any> => {
  return await http.delete<any>(`/services/${id}`, {
    data: { confirm },
  });
};

// 6. API để thêm một service package (combo)
export const addServicePackage = async (
  values: ServicePackageForm,
): Promise<any> => {
  return await http.post<any>("/combos", values);
};

// 7. API để lấy danh sách các packages (combos) với phân trang
export const getListPackages = async (page: number): Promise<any> => {
  return await http.get<any>(`/combos?page=${page}`);
};

// 8. API để xóa một package (combo)
export const deletePackage = async (id: string | null): Promise<any> => {
  return await http.delete<any>(`/combos/${id}`);
};

// 9. API để kiểm tra service có bookings hay không
export const checkServiceHasBooking = async (id: string): Promise<any> => {
  return await http.get<any>(`/services/${id}/check-bookings`);
};

