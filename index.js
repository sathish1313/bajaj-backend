const express = require('express');
const bodyParser = require('body-parser');
const base64 = require('base64-js');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request body
app.use(bodyParser.json());

// Helper function to process the Base64-encoded file
const processFile = (fileB64) => {
  if (!fileB64) {
    return { fileValid: false, fileMimeType: null, fileSizeKb: 0 };
  }

  try {
    const fileBuffer = Buffer.from(fileB64, 'base64'); // Decode Base64 string to Buffer
    const fileSizeKb = (fileBuffer.length / 1024).toFixed(2); // Calculate file size in KB

    // For simplicity, let's assume it's a PNG file for MIME type. Add logic for dynamic MIME detection if needed.
    const fileMimeType = "image/png";

    return { fileValid: true, fileMimeType, fileSizeKb };
  } catch (err) {
    // Invalid Base64 string or processing error
    return { fileValid: false, fileMimeType: null, fileSizeKb: 0 };
  }
};

// Route: /bfhl (POST method)
app.post('/bfhl', (req, res) => {
  const { data, file_b64 } = req.body;

  // Check if 'data' exists and is an array
  if (!data || !Array.isArray(data)) {
    return res.status(400).json({ is_success: false, message: 'Invalid input' });
  }

  // Separate numbers and alphabets from the data array
  const numbers = data.filter(item => !isNaN(item)); // Numbers are those which are valid numeric values
  const alphabets = data.filter(item => isNaN(item) && /^[a-zA-Z]$/.test(item)); // Alphanumeric characters

  // Extract lowercase alphabets and determine the highest one
  const lowercaseAlphabets = alphabets.filter(char => char === char.toLowerCase());
  const highestLowercaseAlphabet = lowercaseAlphabets.length > 0 ? [lowercaseAlphabets.sort().pop()] : [];

  // Process the Base64-encoded file if provided
  const { fileValid, fileMimeType, fileSizeKb } = processFile(file_b64);

  // Sample user data - replace with actual user info if needed
  const userId = 'john_doe_17091999';
  const email = 'john@xyz.com';
  const rollNumber = 'ABCD123';

  // Construct the response
  const response = {
    is_success: true, // Assuming operation is always successful if input is valid
    user_id: userId,
    email: email,
    roll_number: rollNumber,
    numbers: numbers,
    alphabets: alphabets,
    highest_lowercase_alphabet: highestLowercaseAlphabet,
    file_valid: fileValid,
    file_mime_type: fileMimeType,
    file_size_kb: fileSizeKb
  };

  // Return the response
  res.status(200).json(response);
});

// Route: /bfhl (GET method)
app.get('/bfhl', (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
