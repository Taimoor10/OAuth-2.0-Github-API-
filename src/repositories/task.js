function reverseString(str) {
    // Base case: if the string is empty or has only one character, it is already reversed
    if (str.length <= 1) {
        return str;
    }

    return reverseString(str.slice(1)) + str[0];
}

// Example usage:
const originalString = "Hello, World!";
const reversedString = reverseString(originalString);
console.log("Original string:", originalString);
console.log("Reversed string:", reversedString);
