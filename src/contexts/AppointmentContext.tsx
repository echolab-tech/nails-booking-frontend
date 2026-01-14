import React, { createContext, useContext, useReducer, ReactNode } from "react";

interface Customer {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
}

interface Service {
  id: string;
  title: string;
  service_id: string;
  price: number;
  duration: number;
  startTime: string;
  endTime: string;
}

interface ServiceCategory {
  id: string;
  name: string;
}

interface ServiceSummary {
  id: string;
  name: string;
}

interface SubService {
  id: string;
  name: string;
  price: number;
  duration: number;
  startTime: string;
  endTime: string;
}

interface Assistant {
  id: string;
  name: string;
  avatar?: string;
}

interface Appointment {
  customer?: Customer;
  service?: Service | null;
  subServices?: SubService[];
  assistant?: Assistant | null;
  serviceCategory?: ServiceCategory | null;
  serviceSummary?: ServiceSummary | null;
  startTime?: string;
  endTime?: string;
  price?: number;
  duration?: number;
}

interface AppointmentState {
  currentStep: number;
  selectedTime: string;
  appointments: Appointment[];
  currentAppointmentIndex: number;
  appointmentType: "single" | "group" | null;
  appointmentId?: number;
}

type AppointmentKey = keyof Appointment;
const keyByStep: Record<number, AppointmentKey> = {
  2: "serviceSummary",
  3: "serviceCategory",
  4: "service",
  5: "subServices",
};

type AppointmentAction =
  | { type: "SET_STEP"; payload: number }
  | { type: "SET_SELECTED_TIME"; payload: string }
  | { type: "SET_APPOINTMENT_TYPE"; payload: "single" | "group" }
  | { type: "SET_CUSTOMER"; payload: Customer }
  | { type: "SET_SERVICE_SUMMARY"; payload: ServiceSummary }
  | { type: "SET_SERVICE"; payload: Service }
  | { type: "SET_SUB_SERVICE"; payload: SubService }
  | {
      type: "UPDATE_SUB_SERVICES";
      payload: {
        subService: SubService;
        isChecked: boolean;
      };
    }
  | { type: "SET_ASSISTANT"; payload: Assistant }
  | { type: "SET_SERVICE_CATEGORY"; payload: ServiceCategory }
  | { type: "ADD_APPOINTMENT" }
  | { type: "SET_APPOINTMENT_INDEX"; payload: number }
  | { type: "RESET_APPOINTMENT" }
  | { type: "ADD_APPOINTMENT_WITH_CURRENT_CUSTOMER" }
  | { type: "SET_APPOINTMENT_ID_FOR_UPDATE"; payload: number }
  | { type: "UPDATE_SELECTED_TIME"; payload: string }
  | { type: "CLEAR_APPOINTMENT_BY_STEP"; payload: number };

const initialState: AppointmentState = {
  currentStep: 1,
  selectedTime: "",
  appointments: [{}],
  currentAppointmentIndex: 0,
  appointmentType: null,
};

function addMinutesToISOString(datetime: string, minutes: number): string {
  const offset = datetime.substring(19); // +07:00

  // Bỏ offset tạm để parse timestamp
  const datetimeWithoutOffset = datetime.substring(0, 19);
  const baseTimestamp = new Date(datetimeWithoutOffset).getTime();

  // Cộng phút
  const newTimestamp = baseTimestamp + minutes * 60 * 1000;
  const newDate = new Date(newTimestamp);

  // Format lại: yyyy-MM-ddTHH:mm:ss
  const year = newDate.getFullYear();
  const month = String(newDate.getMonth() + 1).padStart(2, "0");
  const day = String(newDate.getDate()).padStart(2, "0");
  const hour = String(newDate.getHours()).padStart(2, "0");
  const minute = String(newDate.getMinutes()).padStart(2, "0");
  const second = String(newDate.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hour}:${minute}:${second}${offset}`;
}

const AppointmentContext = createContext<
  | {
      state: AppointmentState;
      dispatch: React.Dispatch<AppointmentAction>;
    }
  | undefined
>(undefined);

function appointmentReducer(
  state: AppointmentState,
  action: AppointmentAction,
): AppointmentState {
  switch (action.type) {
    case "SET_SELECTED_TIME":
      return {
        ...state,
        selectedTime: action.payload,
      };
    case "SET_STEP":
      return {
        ...state,
        currentStep: action.payload,
      };
    case "SET_CUSTOMER": {
      const customer = action.payload;
      const existingAppointment = state.appointments.find(
        (apt, index) =>
          index !== state.currentAppointmentIndex &&
          apt.customer?.id === customer.id,
      );

      let newStartTime = state.selectedTime; // mặc định nếu chưa có thì lấy selectedTime
      if (existingAppointment) {
        // Nếu đã tồn tại customer -> tìm endTime lớn nhất trong service hoặc subServices
        const serviceEndTime = existingAppointment.service?.endTime || "";
        const lastSubServiceEndTime = existingAppointment.subServices?.length
          ? existingAppointment.subServices[
              existingAppointment.subServices.length - 1
            ].endTime
          : "";

        newStartTime = lastSubServiceEndTime || serviceEndTime || newStartTime;
      }

      return {
        ...state,
        appointments: state.appointments.map((apt, index) =>
          index === state.currentAppointmentIndex
            ? {
                ...apt,
                customer,
                startTime: newStartTime,
              }
            : apt,
        ),
      };
    }
    case "SET_SERVICE_SUMMARY":
      return {
        ...state,
        appointments: state.appointments.map((apt, index) =>
          index === state.currentAppointmentIndex
            ? { ...apt, serviceSummary: action.payload }
            : apt,
        ),
      };
    case "SET_SERVICE":
      var startTimeOfService = state.appointments[state.currentAppointmentIndex]?.startTime;
      const startTime = startTimeOfService !== undefined ? startTimeOfService : state.selectedTime;
      const endTime = addMinutesToISOString(startTime, action.payload.duration);
      const updatedService = {
        ...action.payload,
        startTime,
        endTime,
      };
      return {
        ...state,
        appointments: state.appointments.map((apt, index) =>
          index === state.currentAppointmentIndex
            ? { ...apt, service: updatedService }
            : apt,
        ),
      };
    case "SET_SERVICE_CATEGORY":
      return {
        ...state,
        appointments: state.appointments.map((apt, index) =>
          index === state.currentAppointmentIndex
            ? { ...apt, serviceCategory: action.payload }
            : apt,
        ),
      };
    case "UPDATE_SUB_SERVICES": {
      const { subService, isChecked } = action.payload;
      const activeAppointment =
        state.appointments[state.currentAppointmentIndex];

      if (!activeAppointment.service || !activeAppointment.service.endTime) {
        return state;
      }

      let updatedSubServices = activeAppointment.subServices || [];

      if (isChecked) {
        // Thêm subService nếu chưa có
        if (!updatedSubServices.some((s) => s.id === subService.id)) {
          updatedSubServices = [...updatedSubServices, subService];
        }
      } else {
        // Xóa subService
        updatedSubServices = updatedSubServices.filter(
          (s) => s.id !== subService.id,
        );
      }

      // Sắp xếp lại thời gian startTime, endTime cho các subServices
      let lastEndTime = activeAppointment.service.endTime;

      const recalculatedSubServices = updatedSubServices.map((sub) => {
        const startTime = lastEndTime;
        const endTime = addMinutesToISOString(startTime, sub.duration);
        lastEndTime = endTime;

        return {
          ...sub,
          startTime,
          endTime,
        };
      });

      return {
        ...state,
        appointments: state.appointments.map((apt, index) =>
          index === state.currentAppointmentIndex
            ? {
                ...apt,
                subServices: recalculatedSubServices,
              }
            : apt,
        ),
      };
    }

    case "SET_ASSISTANT":
      return {
        ...state,
        appointments: state.appointments.map((apt, index) =>
          index === state.currentAppointmentIndex
            ? { ...apt, assistant: action.payload }
            : apt,
        ),
      };
    case "SET_APPOINTMENT_TYPE":
      return {
        ...state,
        appointmentType: action.payload,
      };
    case "ADD_APPOINTMENT":
      return {
        ...state,
        appointments: [
          ...state.appointments,
          {
            startTime: state.selectedTime,
          },
        ],
        // Tự động chuyển currentAppointmentIndex sang appointment mới
        currentAppointmentIndex: state.appointments.length,
      };
    case "SET_APPOINTMENT_INDEX":
      return {
        ...state,
        currentAppointmentIndex: action.payload,
      };
    case "RESET_APPOINTMENT":
      return {
        ...initialState,
        selectedTime: state.selectedTime,
      };
    case "ADD_APPOINTMENT_WITH_CURRENT_CUSTOMER":
      const currentAppointment =
        state.appointments[state.currentAppointmentIndex];
      return {
        ...state,
        appointments: [
          ...state.appointments,
          {
            // Copy customer từ appointment hiện tại
            customer: currentAppointment.customer,
            // Reset lại các thông tin khác
            service: null,
            subServices: [],
            assistant: null,
            serviceCategory: null,
            serviceSummary: null,
            startTime: state.selectedTime,
          },
        ],
        // Chuyển index sang appointment mới
        currentAppointmentIndex: state.appointments.length,
      };
    case "SET_APPOINTMENT_ID_FOR_UPDATE":
      return {
        ...state,
        appointmentId: action.payload,
        // customerData: action.payload.customerData,
      };
    case "UPDATE_SELECTED_TIME":
      return {
        ...state,
        appointments: state.appointments.map((apt, index) => {
          if (index !== state.currentAppointmentIndex) return apt;
          if (!apt.service) return apt;
    
          const duration = apt.service.duration || 0;
          const newStart = action.payload;
          const newEnd = addMinutesToISOString(newStart, duration);
          let prevEnd = newEnd;
    
          const updatedSubServices = (apt.subServices || []).map((sub) => {
            const subStart = 	prevEnd;
            const subEnd = addMinutesToISOString(subStart, sub.duration || 0);
            prevEnd = subEnd;
    
            return {
              ...sub,
              startTime: subStart,
              endTime: subEnd,
            };
          });
    
          return {
            ...apt,
            service: {
              ...apt.service,
              startTime: newStart,
              endTime: newEnd,
            },
            subServices: updatedSubServices,
          };
        }),
      };
    case "CLEAR_APPOINTMENT_BY_STEP":
      const step = action.payload;
      const key = keyByStep[step];
      if (!key) return state;
      return {
        ...state,
        appointments: state.appointments.map((apt, index) => {
          if (index !== state.currentAppointmentIndex) return apt;
          if (step === 5) {
            const { service, subServices, ...rest } = apt;
            return rest;
          }

          const { [key]: _, ...rest } = apt;
          return rest;
        }),
      };
    default:
      return state;
  }
}

export function AppointmentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appointmentReducer, initialState);

  return (
    <AppointmentContext.Provider value={{ state, dispatch }}>
      {children}
    </AppointmentContext.Provider>
  );
}

export function useAppointment() {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error(
      "useAppointment must be used within an AppointmentProvider",
    );
  }
  return context;
}
