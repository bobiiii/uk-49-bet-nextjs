export const parseDMYtoDate = (dmy) => {
  const [day, month, year] = dmy.split("-");
  return new Date(`${year}-${month}-${day}`);
};


export const  parseDrawDate = (d_date) => {
  // Remove day name (e.g., "Thursday") and suffixes like "24th"
  const cleaned = d_date
    .replace(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/i, '')
    .replace(/(\d+)(st|nd|rd|th)/, '$1')
    .trim();

  return new Date(cleaned); // Will create a valid Date object
}




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







export function getHotColdOverdueNumbers(draws) {
  // Get the last 100 draws (assuming draws are already sorted newest first)
  const recentDraws = draws.slice(0, 100);

  const frequencyMap = {};
  const seenNumbers = new Set();

  recentDraws.forEach((draw) => {
    const mainBalls = draw.balls.slice(0, 6); // exclude booster ball
    mainBalls.forEach((num) => {
      const n = parseInt(num, 10);
      if (!isNaN(n)) {
        frequencyMap[n] = (frequencyMap[n] || 0) + 1;
        seenNumbers.add(n);
      }
    });
  });

  // Sort numbers by frequency
  const sorted = Object.entries(frequencyMap)
    .map(([num, freq]) => ({ num: parseInt(num, 10), freq }))
    .sort((a, b) => b.freq - a.freq);

  const hotNumbers = sorted.slice(0, 5).map((entry) => entry.num);
  const coldNumbers = sorted.slice(-5).map((entry) => entry.num);

  const overdueNumbers = [];
  for (let i = 1; i <= 49; i++) {
    if (!seenNumbers.has(i)) {
      overdueNumbers.push(i);
    }
  }

  return {
    hotNumbers,
    coldNumbers,
    overdueNumbers: overdueNumbers.slice(0, 5), // limit to 5
  };
}



function formatDrawDate(rawDate) {
  const cleaned = rawDate
    .replace(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/i, '')
    .replace(/(\d+)(st|nd|rd|th)/, '$1')
    .trim();

  const date = new Date(cleaned);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


export function getHotNumbersDetailed(draws) {
  const recentDraws = draws.slice(0, 100); // Take last 100 draws
  const frequencyMap = {};
  const lastSeenMap = {};

  recentDraws.forEach((draw) => {
    const mainBalls = draw.balls;
    const rawDate = draw.d_date;

    // Format d_date like "Thursday24th July 2025" → "2025-07-24"
    const formattedDate = formatDrawDate(rawDate);

    mainBalls.forEach((num) => {
      const n = parseInt(num, 10);
      if (isNaN(n)) return;

      // Count frequency
      frequencyMap[n] = (frequencyMap[n] || 0) + 1;

      // Set last seen only if it's more recent
      const currentLast = lastSeenMap[n];
      if (!currentLast || formattedDate > currentLast) {
        lastSeenMap[n] = formattedDate;
      }
    });
  });

  // Combine into array of objects
  const allStats = Object.keys(frequencyMap).map((numStr) => {
    const number = parseInt(numStr, 10);
    return {
      number,
      frequency: frequencyMap[number],
      lastSeen: lastSeenMap[number],
    };
  });

  // Sort by frequency descending
  const sorted = allStats.sort((a, b) => b.frequency - a.frequency);

  return sorted.slice(0, 10); // Top 10 hot numbers
}


export function getColdNumbersDetailed(draws) {
  // Use the last 100 draws
  const recentDraws = draws.slice(0, 100);

  const frequencyMap = {};
  const lastSeenMap = {};

  recentDraws.forEach((draw) => {
    const allBalls = draw.balls; 
    const rawDate = draw.d_date;
    const formattedDate = formatDrawDate(rawDate); // should return 'YYYY-MM-DD'

    allBalls.forEach((num) => {
      const n = parseInt(num, 10);
      if (isNaN(n)) return;

      // Count how often each number appears
      frequencyMap[n] = (frequencyMap[n] || 0) + 1;

      // Track the most recent date the number appeared
      const currentLast = lastSeenMap[n];
      if (!currentLast || formattedDate > currentLast) {
        lastSeenMap[n] = formattedDate;
      }
    });
  });

  // Convert frequency and last seen data into an array of objects
  const allStats = Object.keys(frequencyMap).map((numStr) => {
    const number = parseInt(numStr, 10);
    return {
      number,
      frequency: frequencyMap[number],
      lastSeen: lastSeenMap[number],
    };
  });

  console.log('====================================');
  console.log("allStats", allStats);
  console.log('====================================');

  // Sort by frequency ASCENDING → coldest = least frequent
  allStats.sort((a, b) => a.frequency - b.frequency);

  return allStats.slice(0, 10); // return top 10 coldest numbers
}




export function getOverdueNumbersDetailed(draws) {
  const recentDraws = draws.slice(0, 100);
  const lastSeenMap = {};

  // Format the draw date
  function formatDrawDate(rawDate) {
    const cleaned = rawDate
      .replace(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/i, '')
      .replace(/(\d+)(st|nd|rd|th)/, '$1')
      .trim();

    const date = new Date(cleaned);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  // Track last seen date for each number
  recentDraws.forEach((draw) => {
    const mainBalls = draw.balls;
    const formattedDate = formatDrawDate(draw.d_date);

    mainBalls.forEach((num) => {
      const n = parseInt(num, 10);
      if (isNaN(n) || n < 1 || n > 49) return;

      if (!lastSeenMap[n] || formattedDate > lastSeenMap[n]) {
        lastSeenMap[n] = formattedDate;
      }
    });
  });

  // Calculate how long ago each number was last seen
  const today = new Date();
  const allNumbers = Array.from({ length: 49 }, (_, i) => i + 1);

  const overdue = allNumbers
    .filter((n) => lastSeenMap[n])
    .map((n) => {
      const lastSeenDate = new Date(lastSeenMap[n]);
      const daysSince = Math.floor((today - lastSeenDate) / (1000 * 60 * 60 * 24));
      return {
        number: n,
        lastSeen: lastSeenMap[n],
        daysSinceLastSeen: daysSince,
      };
    })
    .sort((a, b) => b.daysSinceLastSeen - a.daysSinceLastSeen) // most overdue first
    .slice(0, 10);

  return overdue;
}



export function getNumberFrequencyStats(draws, recent = 50) {
  const frequencyMap = {};
  const limitedDraws = draws.slice(0, recent);

  limitedDraws.forEach(draw => {
    draw.balls.forEach(num => {
      const n = parseInt(num, 10);
      if (isNaN(n)) return;
      frequencyMap[n] = (frequencyMap[n] || 0) + 1;
    });
  });

  const allStats = Object.keys(frequencyMap).map(numStr => {
    const number = parseInt(numStr, 10);
    const count = frequencyMap[number];
    return {
      number,
      count
    };
  });

  const max = Math.max(...allStats.map(n => n.count));

  // Include percentage
  const withPercentage = allStats.map(n => ({
    ...n,
    percentage: Math.round((n.count / max) * 100)
  }));

  return withPercentage.sort((a, b) => b.count - a.count).slice(0, 5);
}




export function getAdditionalStats(draws) {
  const totalDraws = draws.length;

  const freqMap = {};
  let odd = 0;
  let even = 0;

  draws.forEach(draw => {
    draw.balls.forEach(num => {
      const n = parseInt(num, 10);
      if (isNaN(n)) return;

      freqMap[n] = (freqMap[n] || 0) + 1;
      if (n % 2 === 0) even++;
      else odd++;
    });
  });

  const entries = Object.entries(freqMap);
  const sorted = entries.sort((a, b) => b[1] - a[1]);

  return {
    totalDraws,
    mostDrawn: parseInt(sorted[0][0], 10),
    leastDrawn: parseInt(sorted[sorted.length - 1][0], 10),
    oddEvenRatio: `${odd}/${even}`
  };
}


export function getDrawPatternStats(draws) {
  const drawSums = [];
  const consecutiveCounts = [];
  let highLowSplits = [];

  draws.forEach((draw) => {
    const numbers = draw.balls.map((n) => parseInt(n, 10)).filter((n) => !isNaN(n));

    // 1. Sum of draw
    const sum = numbers.reduce((a, b) => a + b, 0);
    drawSums.push(sum);

    // 2. Consecutive count
    let consecutive = 0;
    const sorted = [...numbers].sort((a, b) => a - b);
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] - sorted[i - 1] === 1) consecutive++;
    }
    consecutiveCounts.push(consecutive);

    // 3. High/Low Split
    const high = numbers.filter((n) => n > 24).length;
    const low = numbers.length - high;
    highLowSplits.push({ high, low });
  });

  // Most Common Sum Range
  const sumRanges = {};
  drawSums.forEach((sum) => {
    const rangeStart = Math.floor(sum / 10) * 10;
    const rangeKey = `${rangeStart}-${rangeStart + 9}`;
    sumRanges[rangeKey] = (sumRanges[rangeKey] || 0) + 1;
  });

  const mostCommonRange = Object.entries(sumRanges).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  const averageDrawSum = Math.round(drawSums.reduce((a, b) => a + b, 0) / drawSums.length);
  const avgConsecutive = (consecutiveCounts.reduce((a, b) => a + b, 0) / consecutiveCounts.length).toFixed(1);

  // Average High/Low split
  const totalHigh = highLowSplits.reduce((sum, s) => sum + s.high, 0);
  const totalLow = highLowSplits.reduce((sum, s) => sum + s.low, 0);
  const avgHigh = Math.round(totalHigh / highLowSplits.length);
  const avgLow = Math.round(totalLow / highLowSplits.length);

  return {
    mostCommonRange,
    averageDrawSum,
    avgConsecutive,
    avgHighLowSplit: `${avgLow}/${avgHigh}`
  };
}
