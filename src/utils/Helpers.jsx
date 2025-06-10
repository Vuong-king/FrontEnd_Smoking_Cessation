

export const getFrequencyColor = (frequency) => {
  const colors = {
    daily: "red",
    weekly: "orange",
    occasionally: "yellow",
    social: "green",
  }
  return colors[frequency] || "default"
}

export const getFrequencyLabel = (frequency) => {
  const labels = {
    daily: "Daily",
    weekly: "Weekly",
    occasionally: "Occasionally",
    social: "Social",
  }
  return labels[frequency] || frequency
}