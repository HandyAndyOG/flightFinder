export const flightTime = (departTime: string, arrivalTime: string) => {
    const startTime: Date = new Date(departTime);
    const endTime: Date = new Date(arrivalTime);
    const diffMilliseconds: number = endTime.getTime() - startTime.getTime();
    const diffMinutes: number = diffMilliseconds / 60000;
    const diffHours: number = Math.floor(diffMinutes / 60);
    const remainingMinutes: number = Math.round(diffMinutes % 60);
    return { hours: diffHours, minutes: remainingMinutes };
  };