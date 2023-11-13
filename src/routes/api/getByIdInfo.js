// src/routes/api/getByIdInfo.js
const { createErrorResponse, createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async function getMetadataById(req, res) {
  try {
    logger.debug(`getMetadataById is invoked with the fragment ID ${req.params.id}`);
    const fragment = await Fragment.byId(req.user, req.params.id);
    logger.debug(`getMetadataById retrieved metadata for fragment ID ${req.params.id}`);
    res.status(200).json(createSuccessResponse({ fragment }));
  } catch (error) {
    logger.warn(`invalid fragment id ${req.params.id}`);
    res.status(404).json(createErrorResponse(404, error.message));
  }
};
