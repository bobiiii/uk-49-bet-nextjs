export const parseDMYtoDate = (dmy) => {
  const [day, month, year] = dmy.split("-");
  return new Date(`${year}-${month}-${day}`);
};

const parseCustomDate = (rawDate) => {
    const date = new Date(
      rawDate
        .replace(
          /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/i,
          ""
        ) // remove weekday
        .replace(/(\d+)(st|nd|rd|th)/, "$1") // remove ordinal suffix
        .trim()
    );

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

export const formatResult = (result, drawType) => {
  const balls = result?.balls || [];

  return {
    id: result._id, // or result.id based on your API
    date: parseCustomDate(result["d_date"]), // "dd-mm-yyyy"
    draw: drawType, // manually assigned
    time: result.resultTime,
    numbers: balls.slice(0, -1).map((num) => parseInt(num, 10)),
    boosterBall: parseInt(balls.at(-1), 10),
  };
};
