// src/routes/api/get.js
const { createSuccessResponse } = require('../../response');

module.exports = (req, res) => {
  const fragments = [];
  const response = createSuccessResponse({ fragments });
  res.status(200).json(response);
};
