
const characterMap = {
  number: "0123456789",
  alphanumeric: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  alphanumeric_upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  alphanumeric_lower: "abcdefghijklmnopqrstuvwxyz0123456789"
}

const randomGen = (type: keyof typeof characterMap, length: number) => {
  let characters = shuffle(characterMap[type])
  let result = '';
  let charsLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charsLength));
  }

  return result;
}

function shuffle(str: string) {
  let j, temp, i;
  let a = str.split('');

  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = a[i];
    a[i] = a[j];
    a[j] = temp;
  }
  return a.join('');
}

export default randomGen;