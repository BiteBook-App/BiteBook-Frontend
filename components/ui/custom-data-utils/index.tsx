/**
 * Formats a date string based on how recent it is
 * - Today: Returns time (HH:MM)
 * - This year: Returns Month Day (January 15)
 * - Previous years: Returns MM-DD-YY (01-15-23)
 * 
 * @param dateString - ISO date string to format
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
    const postDate = new Date(dateString);
    const today = new Date();
  
    // Check if the post is from today
    const isToday = postDate.toDateString() === today.toDateString();
  
    // Check if the post is from this year (but not today)
    const isThisYear = postDate.getFullYear() === today.getFullYear();
  
    if (isToday) {
      // Return time in HH:MM format if today
      return postDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (isThisYear) {
      // Return Month Day if it's this year (but not today)
      return postDate.toLocaleDateString("en-US", { month: 'long', day: 'numeric' });
    } else {
      // Return MM-DD-YY format if it's not from this year
      return postDate.toLocaleDateString("en-US", { month: '2-digit', day: '2-digit', year: '2-digit' });
    }
  };