/**
 * Part 1
 * Create a function that takes a string as input and checks if it's a palindrome (if it's the same when reversed).
 * Do this without using loops (hint: you can use Array.from to convert a string into an array).
 * Check that the type of the parameter is "string", and the lenght is at least 1 or show an error
 * Example: isPalindrome("abeceba") -> true
 */

console.log("EXERCISE 1 - PART 1");

function isPalindrome(word){
    let arr = Array.from(word);
    let reversedArr = Array.from(word).reverse();

    return arr.join('') === reversedArr.join('');

}
console.log(isPalindrome("abeceba"));
console.log(isPalindrome("Hola"));

/**
 * Part 2
 * Develop a function that compresses a string by replacing consecutive repeating characters with
 * the character and the count of repetitions. For example, "AAAABBBCC" would become "4A3B2C".
 * Example: stringCompression("GGGHHRRRRRRRUIIIOOOO") -> 3G2H7R1U3I4O
 */

console.log("EXERCISE 1 - PART 2");

function stringCompression(word){
    let compressed = '';
    let count = 1;
    for (let i = 0; i < word.length; i++){
        if(word[i] === word[i + 1]){
            count++;
        }else{
            compressed += count + word[i];
            count = 1;
        }
    }
    console.log(compressed);
}

stringCompression("GGGHHRRRRRRRUIIIOOOO");
stringCompression("AAAABBBCC");

/**
 * Part 3
 * Create a function that takes an array of numbers containing duplicate values. It should return the
 * first number that is repeated in the array, or -1 if there are no duplicates.
 * Do not use loops, and  if you don't know how to do it without loops, you can only use one loop
 * (.forEach counts as a loop).
 * Example: findFirstRepeated([1,4,7,3,8,4,5,5,1]) -> 4
 */

console.log("EXERCISE 1 - PART 3");

function findFirstRepeated(numberArray) {
    let repeated = -1;
    let numbersUsed = []; 
    numberArray.forEach(num => {
        let found = false; 
        
        for (let i = 0; i < numbersUsed.length; i++) {
            if (numbersUsed[i] === num) {
                found = true;
            }
        }
        
        if (found) {
            if (repeated === -1) {
                repeated = num;
            }
        } else {
            numbersUsed.push(num);
        }
    });
    
    return repeated;
}

console.log(findFirstRepeated([1, 4, 7, 3, 8, 4, 5, 5, 1]));
console.log(findFirstRepeated([1, 2, 3, 4, 5]));


/**
 * Part 4
 * Create a function that takes an array of strings as the first parameter and a string as the second.
 * It should return a new array containing the words from the first array whose letters are all present
 * in the second string. Try not to use loops.
 * Example: filterWords(["house", "car", "watch", "table"], "catboulerham") -> ['car', 'table']
 */

console.log("EXERCISE 1 - PART 4");

function filterWords(words, letters) {
    const containsAllLetters = word => 
        word.split('').every(char => letters.includes(char));
    
    return words.filter(containsAllLetters);
}
console.log(filterWords(["house", "car", "watch", "table"], "catboulerham"));

/**
 * Part 5
 * Create a function that takes an array of lights represented by the characters '🔴' and '🟢'.
 * The function should check if the lights are alternating (e.g., ['🔴', '🟢', '🔴', '🟢', '🔴']).
 * Return the minimum number of lights that need to be changed to make the lights alternate.
 * Example: adjustLights(['🔴', '🔴', '🟢', '🔴', '🟢'])  -> 1 (change the first light to green)
 */
console.log("EXERCISE 1 - PART 5");
function adjustLights(lights) {
    const position1 = ['🔴', '🟢'];
    const position2 = ['🟢', '🔴'];

    let changesPosition1 = 0; 
    let changesPosition2 = 0;

    for (let i = 0; i < lights.length; i++) {
        if (lights[i] !== position1[i % 2]) {
            changesPosition1++;
        }

        if (lights[i] !== position2[i % 2]) {
            changesPosition2++;
        }
    }
    return changesPosition1 < changesPosition2 ? changesPosition1 : changesPosition2;
}

console.log(adjustLights(['🔴', '🔴', '🟢', '🔴', '🟢']));


/**
 * Part 6
 * Create a Map collection where the key is the name of a dish and the value is an array of ingredients.
 * From this Map, generate another Map where the key is the ingredient name and the value is an array of
 * dishes where that ingredient appears.
 */

console.log("EXERCISE 1 - PART 6");

function invertDish(dishes) {
    const ingredientMap = new Map();

    dishes.forEach(([dish, ingredients]) => {
        ingredients.forEach(ingredient => {
            if (!ingredientMap.has(ingredient)) {
                ingredientMap.set(ingredient, []);
            }
            ingredientMap.get(ingredient).push(dish);
        });
    });

    return ingredientMap;
}

const result = invertDish([
    ['tortilla', ['egg', 'potato', 'onion']],
    ['cake', ['egg', 'sugar', 'flour']],
    ['special rice', ['egg', 'rice', 'onion']]
]);

console.log(result);


/**
 * Part 7
 * Create a funcion that can receive as many numbers as you want by parameter. Use rest to group them in
 * an array and print the ones that are even and the ones that arre odd separately.
 * DON'T use loops (for, while, etc.)
 */
console.log("EXERCISE 1 - PART 7");

function reciveNumber(...numbers) {
    even = numbers.filter(num => num % 2 === 0);
    odd = numbers.filter(num => num % 2 !== 0);

    console.log("Even numbers: ", even);
    console.log("odd numbers: ", odd);
}
reciveNumber(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

/**
 * Part 8
 * Create a function that receives an array and adds the first three numbers of the array.
 * Use array destructuring in the parameters to get those three numbers.
 * If any of those numbers is not present in the array, a default value of 0 will be assigned
 * Return the result of adding those three numbers
 */

console.log("EXERCISE 1 - PART 8");

function addNumbers([num1 = 0, num2 = 0, num3 = 0]) {
    return num1 + num2 + num3;
}

console.log(addNumbers([1,2,3]));
console.log(addNumbers([1,2]));
console.log(addNumbers([1]));
console.log(addNumbers([]));



/**
 * Create a function that takes an indeterminate number of strings as arguments,
 * groups them into an array, and returns a new array containing the length of each string.
 * Do not use loops.
 * Example: getStringLengths("potato", "milk", "car", "table") -> [6, 4, 3, 5]
 */

console.log("EXERCISE 1 - PART 9");
function getStringLength(...string) {
    return string.map(str => str.length);
}
console.log(getStringLength("Hello", "Amazon"));


/**
 * Part 10
 * Create an array, and without modifying it, generate the following derived arrays (each new array derives from the previous one):
 * - Add 2 elements to the beginning of the array
 * - Delete positions 4 and 5
 * - Concatenate the elements of another array to the end Show the resulting array after each operation.
 *
 * No operation performed should modify the array on which it operates. Show the original array at the end.
 */

console.log("EXERCISE 1 - PART 10");

const originalArray = [1, 2, 3, 9, 8, 7, 6, 5];

const addToArray = [0, -1].concat(originalArray);
console.log("Added elements: ", addToArray);

const removedArray = addToArray.slice(0, 4).concat(addToArray.slice(6));
console.log("Position 4 and 5 deleted: ", removedArray);

const newArray = [8, 9];
const concatenatedArray = removedArray.concat(newArray);
console.log("Concatenate array whit another array: ", concatenatedArray);

console.log("Original Array: ", originalArray);
