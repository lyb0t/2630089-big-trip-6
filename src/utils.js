function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function formatToMonthDay(isoString) {
  const date = new Date(isoString);
  const monthNames = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  const month = monthNames[date.getUTCMonth()];
  const day = date.getUTCDate();
  return `${month} ${day}`;
}

function capitalizeFirstLetter(str) {
  if (!str) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function padZero(str) {
  return String(str).padStart(2, "0");
}

function dateDifference(date1, date2) {
  // Преобразуем входные данные в объекты Date, если они ещё не являются таковыми
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  // Разница в миллисекундах (всегда положительное число, можно взять по модулю)
  const diffMs = Math.abs(d2 - d1);

  // Перевод в разные единицы
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  const remainderSeconds = diffSeconds % 60;
  const remainderMinutes = diffMinutes % 60;
  const remainderHours = diffHours % 24;

  let diffStr = "";
  if (diffDays) {
    diffStr += ` ${padZero(diffDays)}D`;
  }
  if (remainderHours) {
    diffStr += ` ${padZero(remainderHours)}H`;
  }
  if (remainderMinutes) {
    diffStr += ` ${padZero(remainderMinutes)}M`;
  }

  return {
    milliseconds: diffMs,
    seconds: diffSeconds,
    minutes: diffMinutes,
    hours: diffHours,
    days: diffDays,
    remainderSeconds,
    remainderMinutes,
    remainderHours,
    diffStr: diffStr.slice(1),
  };
}

export {
  getRandomArrayElement,
  formatToMonthDay,
  capitalizeFirstLetter,
  dateDifference,
};
