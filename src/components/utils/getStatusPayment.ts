export const getStatusPayment = (status: number) => {
  switch (status) {
    case 1:
      return "Fail";
      break;
    case 2:
      return "Success";
    case 3:
      return "Refund";
    default:
      break;
  }
};
