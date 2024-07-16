export type ListOpenHoursType = {
    days: string;
    time: {
        id?: string;
        from: string;
        to: string;
        isDelete?: boolean;
        status: number
        days_of_week: string
    isNewInput?: boolean
    }[];
    isChecked: boolean
  };
  export type DataCreateOpenHours = {
    open_hours:{
      id?: number,
      start_time: string,
      end_time: string,
      isDelete: boolean,
      days_of_week: string,
      status: number,
    }[]
  }