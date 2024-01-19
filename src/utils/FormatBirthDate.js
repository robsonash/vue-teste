export function formatBirthDate(birthDate) {
  if (/\d{2}\/\d{2}\/\d{4}/.test(birthDate)) {
    const [day, month, year] = birthDate.split("/");
    return `${year}-${month}-${day}`;
  } else if (/\d{4}-\d{2}-\d{2}/.test(birthDate)) {
    const [year, month, day] = birthDate.split("-");
    return `${day}/${month}/${year}`;
  } else {
    return birthDate;
  }
}
