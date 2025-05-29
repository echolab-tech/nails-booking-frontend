// export type ServiceSummaryType = {
//   id: number; // ID của service_summary
//   name: string; // Tên của service_summary
//   is_active: number; // Trạng thái kích hoạt
//   created_at: string; // Ngày tạo
//   updated_at: string; // Ngày cập nhật
//   deleted_at: string | null; // Ngày xóa (nếu có)
//   pivot: {
//     service_category_id: number; // ID của category
//     service_summary_id: number; // ID của summary
//   };
// };
export type CategoryType = {
  id: string;
  name: string;
  color: string;
  is_active: number;
  service_summaries: Array<{
    id: number;
    name: string;
  }>;
};
