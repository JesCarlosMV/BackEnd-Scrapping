// funcion que recibe un array de <buffer> y retorna el primer elemento convertido a base64
const buffersToBase64 = (buffers) => {
  const buffer = buffers[0];
  const base64 = buffer.toString('base64');
  return base64;
};

module.exports = {
  buffersToBase64,
};
