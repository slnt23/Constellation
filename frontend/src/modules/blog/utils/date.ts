/**
 * Format date string to locale date string
 * @param dateStr - Date string to format
 * @returns Formatted date string (e.g., "Sep 2, 2026")
 */
export function formatDate(dateStr: string): string {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}