
export type ScheduledOfUser = {
  days: string;
  time: {
    id?: string;
    from: string;
    assistant_id?: number,
    date :string,
    to: string;
  }[];
};

export type ScheduledOfAssistant = {
  schedules:{
    id?: string;
    start_time: string;
    assistant_id?: number,
    date :string,
    end_time: string;
    weekdays: string
  }[]
}

export type Schedule = {
  start_time: string
  end_time: string
}
