export const sortAlerts = (a, b) => {
  if (a.read && !b.read) {
    return 1
  } else if (!a.read && b.read) {
    return -1
  } else if (a.read && b.read) {
    return a.date_created - b.date_created
  } else {
    return b.date_created - a.date_created
  }
}