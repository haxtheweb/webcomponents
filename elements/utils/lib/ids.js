/**
 * Generate a uinque ID
 */
export function generateResourceID(base = "#") {
  function idPart() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return (
    base +
    idPart() +
    idPart() +
    "-" +
    idPart() +
    "-" +
    idPart() +
    "-" +
    idPart() +
    "-" +
    idPart() +
    idPart() +
    idPart()
  );
}
