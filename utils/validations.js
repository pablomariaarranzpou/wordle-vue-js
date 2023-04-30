const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/

// export const email = val => emailPattern.test(val) || 'Email incorrecto'
export const email = (val) => {
  return emailPattern.test(val) || 'Email incorrecto'
}
export const required = val => !!val || 'Campo requerido'
export const range = (val, min, max) => {
  if (!val)
    return "Campo requerido"
  else {
    if (Number(val) < Number(min)) {
      return "Debes introducir un número mayor o igual a " + min;
    }
    if (Number(val) > Number(max)) {
      return "Debes introducir un número menor o igual a " + max;
    }
  }
  return true;
}
export const length = (val, min, max) => {
  if (!val)
    return "Campo requerido"
  else {
    if (val.length < min) {
      return "El texto no debe ser menor a " + min + " caracteres";
    }
    if (val.length > max) {
      return "El texto no debe superar " + max + " caracteres";
    }
  }
  return true;
}
