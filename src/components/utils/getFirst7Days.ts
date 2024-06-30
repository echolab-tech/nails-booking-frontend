export const getFirst7Days = () => {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Tháng từ 0-11 nên cần +1 và padStart để đảm bảo định dạng 2 chữ số
    const day = d.getDate().toString().padStart(2, '0'); // padStart để đảm bảo định dạng 2 chữ số

    const dayString = `${year}-${month}-${day}`;
    days.push(dayString);
  }
  return days;
};
