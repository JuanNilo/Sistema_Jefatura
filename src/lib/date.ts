export function isPastOrToday(date: Date): boolean {
  const today = new Date();
  const normalizedInput = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const normalizedToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  return normalizedInput.getTime() <= normalizedToday.getTime();
}

