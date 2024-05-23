import { stringify } from "uuid";

export type ScheduledOfUser = {
  days: string;
  time: {
    id: string;
    from: string;
    to: string;
  }[];
};
