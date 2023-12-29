import dayjs from "dayjs";

export const isTaskOverdue = (dueDate: string | undefined) => {
  if (typeof dueDate !== "undefined") {
    const today = dayjs();

    const deadline = dayjs(dueDate);

    return deadline.isBefore(today, "day");
  }
};
