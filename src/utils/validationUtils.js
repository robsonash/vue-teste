export function isRequired(value, errorMessage) {
  return !!value || errorMessage;
}

export function isValidCPF(cpf, errorMessage) {
  cpf = cpf.replace(/\D/g, "");

  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    return errorMessage;
  }

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let remainder = 11 - (sum % 11);
  let firstDigit = remainder === 10 || remainder === 11 ? 0 : remainder;

  if (firstDigit !== parseInt(cpf.charAt(9))) {
    return errorMessage;
  }

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = 11 - (sum % 11);
  let secondDigit = remainder === 10 || remainder === 11 ? 0 : remainder;

  if (secondDigit !== parseInt(cpf.charAt(10))) {
    return errorMessage;
  }

  return true;
}

export function isValidDate(dateString, errorMessage) {
  return dateString.length >= 10 || errorMessage;
}
