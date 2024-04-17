import { getQuestion, getQuestionLen } from "./database_query";

// Get question based in ID
export async function getQuestionWithId(questionId) {
  try {
    const result = await getQuestion(questionId);
    return result;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

// Get number of question records
export async function getQuestionsLength() {
  try {
    const result = await getQuestionLen();
    return result;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

// Get random number for question, excluding array of already used values
export function getRandomNumberInRange(min, max, forbiddenValues) {
  var randomNum;
  const maxAttempts = max * 2;
  var saveStop = 0;

  for (let i = 0; i < maxAttempts; i++) {
    randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    saveStop++;
    if (!forbiddenValues.includes(randomNum)) {
      break;
    }
  }

  if (saveStop === maxAttempts) {
    return -1;
  }

  return randomNum;
}

// Shuffle elements of array
export function shuffle(array) {
  let currentIndex = array.length;
  let randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

// Fill array with zeroes
export function fillWithZeroes(amount) {
  var result = [];
  for (let i = 0; i < amount; i++) {
    result.push(0);
  }
  return result;
}

// Compare answeres in json objects
export function compareObjects(answer, correct) {
  const keys = Object.keys(answer);

  // Check if the values for each key are the same
  for (const key of keys) {
    if (answer[key] !== correct[key]) {
      return false;
    }
  }

  return true;
}

export function compareObjectsRange(answer, correct) {
  const keys = Object.keys(answer);

  // Check if the values for each key are the same
  for (const key of keys) {
    if (Math.abs(answer[key] - correct[key]) > correct[key] / 10) {
      return false;
    }
  }

  return true;
}

export function compareRange(answer, correct) {
  const tolerance = correct * 0.1; // Calculate 10% of correct value

  if (Math.abs(answer - correct) > tolerance) {
    return false; // Answer is too far from correct
  }

  return true; // Answer is within 10% range of correct
}

// Get random keys from an objects, excluding already answered options
export function getRandomKeys(obj, amountOfKeys, forbiddenKeys) {
  const keys = Object.keys(obj).filter((key) => !forbiddenKeys.includes(key));
  const shuffledKeys = shuffle(keys);
  return shuffledKeys.slice(0, amountOfKeys);
}

// Get object with selected keys
export function getObjectWithKeys(obj, randomKeys) {
  const newObj = {};
  randomKeys.forEach((key) => {
    newObj[key] = obj[key];
  });
  return newObj;
}

export function findKeyByValue(object, value) {
  // Iterate over the keys of the object
  for (let key in object) {
    // Check if the current key's value matches the given value
    if (object[key] === value) {
      // If a match is found, return the key
      return key;
    }
  }
  // If no match is found, return null or handle the case accordingly
  return null;
}

export function changeKey(input) {
  if (input.includes("SubQuestion"))
    return input.replace("SubQuestion", "Answer");
  if (input.includes("Answer")) return input.replace("Answer", "SubQuestion");
}
