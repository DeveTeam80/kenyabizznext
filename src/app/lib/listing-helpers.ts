// src/app/lib/listing-helpers.ts

export function extractSubCategory(categories: any[]): string {
  if (!categories || categories.length === 0) return ''
  const primary = categories.find(cat => cat.isPrimary)
  return primary?.slug || categories[0]?.slug || ''
}

export function normalizeWorkingHours(hours: any[]) {
  const defaultHours = [
    { day: 'Monday', opening: '', closing: '' },
    { day: 'Tuesday', opening: '', closing: '' },
    { day: 'Wednesday', opening: '', closing: '' },
    { day: 'Thursday', opening: '', closing: '' },
    { day: 'Friday', opening: '', closing: '' },
    { day: 'Saturday', opening: '', closing: '' },
    { day: 'Sunday', opening: '', closing: '' },
  ]

  if (!hours || hours.length === 0) return defaultHours
  
  // Already in new format
  if (hours[0] && 'opening' in hours[0]) return hours

  // Old format with 'hours' property
  if (hours[0] && 'hours' in hours[0]) {
    const normalized = [...defaultHours]

    hours.forEach((oldHour: any) => {
      const dayStr = oldHour.day
      const hoursStr = oldHour.hours

      // Handle day ranges like "Monday - Saturday"
      if (dayStr.includes(' - ')) {
        const [startDay, endDay] = dayStr.split(' - ').map((d: string) => d.trim())
        
        const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        const startIndex = dayNames.indexOf(startDay)
        const endIndex = dayNames.indexOf(endDay)

        if (startIndex !== -1 && endIndex !== -1) {
          // Apply hours to all days in range
          for (let i = startIndex; i <= endIndex; i++) {
            const dayName = dayNames[i]
            const index = normalized.findIndex(d => d.day === dayName)
            
            if (index !== -1) {
              if (hoursStr === 'CLOSED') {
                normalized[index] = { day: dayName, opening: 'Closed', closing: 'Closed' }
              } else if (hoursStr === '24/7') {
                normalized[index] = { day: dayName, opening: '24/7', closing: '24/7' }
              } else if (hoursStr.includes(' - ')) {
                const [opening, closing] = hoursStr.split(' - ').map((t: string) => t.trim())
                normalized[index] = { day: dayName, opening, closing }
              }
            }
          }
        }
      } 
      // Handle multiple days like "Monday, Wednesday, Friday"
      else if (dayStr.includes(',')) {
        const days = dayStr.split(',').map((d: string) => d.trim())
        days.forEach((dayName: string) => {
          const index = normalized.findIndex(d => d.day === dayName)
          if (index !== -1) {
            if (hoursStr === 'CLOSED') {
              normalized[index] = { day: dayName, opening: 'Closed', closing: 'Closed' }
            } else if (hoursStr === '24/7') {
              normalized[index] = { day: dayName, opening: '24/7', closing: '24/7' }
            } else if (hoursStr.includes(' - ')) {
              const [opening, closing] = hoursStr.split(' - ').map((t: string) => t.trim())
              normalized[index] = { day: dayName, opening, closing }
            }
          }
        })
      }
      // Handle single day
      else {
        const dayName = dayStr
        const index = normalized.findIndex(d => d.day === dayName)
        
        if (index !== -1) {
          if (hoursStr === 'CLOSED') {
            normalized[index] = { day: dayName, opening: 'Closed', closing: 'Closed' }
          } else if (hoursStr === '24/7') {
            normalized[index] = { day: dayName, opening: '24/7', closing: '24/7' }
          } else if (hoursStr.includes(' - ')) {
            const [opening, closing] = hoursStr.split(' - ').map((t: string) => t.trim())
            normalized[index] = { day: dayName, opening, closing }
          }
        }
      }
    })

    return normalized
  }

  return defaultHours
}

export function is24_7Hours(hours: any[]): boolean {
  if (!hours || hours.length === 0) return false
  return hours[0]?.hours === '24/7'
}