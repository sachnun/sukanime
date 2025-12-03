// Mapping Indonesian day names to day numbers (0 = Sunday)
const dayMap: Record<string, number> = {
  'Minggu': 0,
  'Senin': 1,
  'Selasa': 2,
  'Rabu': 3,
  'Kamis': 4,
  'Jumat': 5,
  'Sabtu': 6,
};

/**
 * Parse Indonesian date string like "03 Des" to check if it's today
 */
function isReleaseDateToday(releaseDate: string | undefined): boolean {
  if (!releaseDate) return false;
  
  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth(); // 0-indexed
  
  // Month mapping for Indonesian short month names
  const monthMap: Record<string, number> = {
    'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3,
    'mei': 4, 'jun': 5, 'jul': 6, 'agu': 7, 'agt': 7,
    'sep': 8, 'okt': 9, 'nov': 10, 'des': 11
  };
  
  // Parse "03 Des" format
  const parts = releaseDate.toLowerCase().trim().split(' ');
  if (parts.length < 2) return false;
  
  const day = parseInt(parts[0], 10);
  const monthStr = parts[1].slice(0, 3);
  const month = monthMap[monthStr];
  
  if (isNaN(day) || month === undefined) return false;
  
  return day === currentDay && month === currentMonth;
}

/**
 * Calculate time until next episode release
 * 
 * @param releaseDay - Indonesian day name (e.g., "Senin", "Selasa")
 * @param releaseDate - Date string like "03 Des" to check if just released
 * @returns Object with time info or null if can't calculate
 */
export function getNextReleaseTime(releaseDay: string | undefined, releaseDate?: string): {
  days: number;
  hours: number;
  minutes: number;
  totalHours: number;
  text: string;
  isToday: boolean;
  isSoon: boolean;
  justReleased: boolean;
} | null {
  if (!releaseDay) return null;

  const targetDayNum = dayMap[releaseDay];
  if (targetDayNum === undefined) return null;

  const now = new Date();
  const currentDayNum = now.getDay();

  // Check if episode was ALREADY released today (based on releaseDate from API)
  if (isReleaseDateToday(releaseDate)) {
    return {
      days: 7,
      hours: 0,
      minutes: 0,
      totalHours: 7 * 24,
      text: 'Baru',
      isToday: false,
      isSoon: false,
      justReleased: true,
    };
  }

  // Calculate days until next release
  let daysUntil = targetDayNum - currentDayNum;
  if (daysUntil <= 0) {
    daysUntil += 7;
  }

  // Generate human-readable text
  let text: string;
  if (daysUntil === 1) {
    text = 'Besok';
  } else if (daysUntil <= 2) {
    text = `${daysUntil} hari lagi`;
  } else {
    text = releaseDay; // Just show the day name for 3+ days
  }

  const totalHours = daysUntil * 24;

  return {
    days: daysUntil,
    hours: 0,
    minutes: 0,
    totalHours,
    text,
    isToday: false,
    isSoon: daysUntil === 1,
    justReleased: false,
  };
}

/**
 * Get color class based on urgency
 */
export function getReleaseTimeColor(releaseInfo: ReturnType<typeof getNextReleaseTime>): string {
  if (!releaseInfo) return 'text-muted';
  
  if (releaseInfo.justReleased) {
    return 'text-green-400'; // Just released - green
  } else if (releaseInfo.isSoon) {
    return 'text-blue-400'; // Tomorrow - blue
  }
  return 'text-muted'; // 2+ days - muted
}
