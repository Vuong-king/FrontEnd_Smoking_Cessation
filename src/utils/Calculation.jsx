
export const calculateTotalCost = (record) => {
  const startDate = new Date(record.start_date)
  const currentDate = new Date()
  const daysDiff = Math.ceil((currentDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24))
  
  return (record.cigarettes_per_day / 20) * record.cost_per_pack * daysDiff
}

export const calculateDays = (startDate) => {
  const start = new Date(startDate)
  const current = new Date()
  return Math.ceil((current.getTime() - start.getTime()) / (1000 * 3600 * 24))
}