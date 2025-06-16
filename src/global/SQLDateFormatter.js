function DateForm(date) {
  this.year = parseInt(date.substring(0, 4))
  this.month = parseInt(date.substring(5, 7)) - 1;
  this.day = parseInt(date.substring(8, 10));
  this.hour = parseInt(date.substring(11, 13)) + 9;  // 한국 시간 GMT+9
  this.minute = parseInt(date.substring(14, 16));
  this.second = parseInt(date.substring(17, 19));
}

export function sqlDateToRelativeTimeString(date) {
  const dateform = new DateForm(date);

  const parsedDate = new Date(dateform.year, dateform.month, dateform.day, dateform.minute, dateform.second);
  const now = new Date();
  const diffTime = now.getTime() - parsedDate.getTime();

  if (diffTime / 1000 <= 60)
    return `${Math.floor(diffTime / 1000)}초 전`;
  else if (diffTime / (1000 * 60) <= 60)
    return `${Math.floor(diffTime / (1000 * 60))}분 전`;
  else if (diffTime / (1000 * 60 * 60) <= 24)
    return `${Math.floor(diffTime / (1000 * 60 * 60))}시간 전`;
  else if (parsedDate.getFullYear() === now.getFullYear()) {
    return `${parsedDate.getMonth() + 1}월 ${parsedDate.getDate()}일`;
  } else {
    return `${parsedDate.getFullYear()}.${parsedDate.getMonth() + 1}.${parsedDate.getDate()}`;
  }
}

export function sqlDateToFixedTimeString(date) {
  const dateform = new DateForm(date);

  const now = new Date();
  if (now.getFullYear() === dateform.year)
    return `${dateform.month}월 ${dateform.day}일 ${dateform.hour}:${dateform.minute}`;
}