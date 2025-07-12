export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // remove invalid chars
    .replace(/\s+/g, '-')         // collapse whitespace and replace by -
    .replace(/-+/g, '-');         // collapse dashes
};


export const handleImageUpload = async (quillRef) => {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.click();

  input.onchange = async () => {
    const file = input.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/news/upload-image', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (res.ok && data.url) {
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection(true);

        quill.insertEmbed(range.index, 'image', data.url);
        quill.setSelection(range.index + 1);
      } else {
        alert('Image upload failed');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      alert('An error occurred while uploading image.');
    }
  };
};



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
  

  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  // Filter draws within the last 30 days
  const recentDraws = draws
    .filter((draw) => {
      const drawDate = parseDrawDate(draw.d_date);
      return drawDate >= thirtyDaysAgo && drawDate <= today;
    })
    .sort((a, b) => {
      const dateA = parseDrawDate(a.d_date);
      const dateB = parseDrawDate(b.d_date);
      return dateB - dateA;
    });

  const frequencyMap = {};
  const seenNumbers = new Set();

  // Analyze each draw
  recentDraws.forEach((draw) => {
    const balls = draw.balls; // include all 7 balls

    balls.forEach((num) => {
      const n = parseInt(num, 10);
      if (!isNaN(n)) {
        frequencyMap[n] = (frequencyMap[n] || 0) + 1;
        seenNumbers.add(n);
      }
    });
  });

  // Convert frequency map to sorted array
  const sorted = Object.entries(frequencyMap)
    .map(([num, freq]) => ({ num: parseInt(num, 10), freq }))
    .sort((a, b) => b.freq - a.freq);

  // Hot = most frequent
  const hotNumbers = sorted.slice(0, 5).map((entry) => entry.num);

  // Cold = least frequent
  const coldNumbers = sorted.slice(-5).map((entry) => entry.num);

  // Overdue = numbers from 1 to 49 not seen at all
  const topOverdueNumbers = [];
  for (let i = 1; i <= 49; i++) {
    if (!seenNumbers.has(i)) {
      topOverdueNumbers.push(i);
    }
  }
  const overdueNumbers = topOverdueNumbers.slice(0, 5);

  return {
    hotNumbers,
    coldNumbers,
    overdueNumbers,
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
  const recentDraws = draws.slice(0, 100);      // Most recent 100 draws
  const olderDraws = draws.slice(100);          // Older draws
  const seenInRecent = new Set();

  // Step 1: Track numbers in the last 100 draws
  recentDraws.forEach((draw) => {
    draw.balls.forEach((num) => {
      const n = parseInt(num, 10);
      if (!isNaN(n) && n >= 1 && n <= 49) {
        seenInRecent.add(n);
      }
    });
  });

  const overdue = [];

  // Step 2: Find numbers not in last 100 but seen before
  for (let i = 1; i <= 49; i++) {
    if (!seenInRecent.has(i)) {
      // Check if it appeared in older draws
      const lastSeenDraw = olderDraws.find(draw =>
        draw.balls.includes(i.toString()) || draw.balls.includes(i)
      );

      if (lastSeenDraw) {
        const lastSeenDateStr = lastSeenDraw.d_date || lastSeenDraw.date;
        const lastSeenDate = new Date(lastSeenDateStr);
        const today = new Date();
        const daysAgo = Math.floor((today - lastSeenDate) / (1000 * 60 * 60 * 24));

        overdue.push({
          number: i,
          lastSeen: lastSeenDate.toLocaleDateString('en-GB'),
          daysAgo,
        });
      }
    }
  }

  return overdue.slice(0, 10); // Return up to 10 most overdue numbers
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