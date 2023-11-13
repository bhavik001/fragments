// src/routes/api/getById.js
const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const path = require('path');
const mime = require('mime-types');

module.exports = async (req, res) => {
  try {
    logger.debug(`getById is invoked with fragment ID ${req.params.id}`);

    let id = req.params.id.split('.')[0];

    const fragment = await Fragment.byId(req.user, id);

    logger.debug(`getById retrieved fragment with ID ${fragment.id}`);

    try {
      const fragmentData = await fragment.getData();
      logger.debug(`getById retrieved fragment data for ID ${fragment.id}`);

      const extension = path.extname(req.params.id);
      logger.debug(`getById extension: ${extension}`);

      if (extension) {
        logger.debug('Convert fragment to type: ' + extension);
        var resultData = await fragment.convertTo(fragmentData, extension);
        res.setHeader('Content-Type', mime.lookup(extension));
        res.status(200).send(resultData);
      } else {
        res.setHeader('Content-Type', fragment.type);
        res.status(200).send(fragmentData);
      }
    } catch (error) {
      res.status(415).json(createErrorResponse(415, error.message));
    }
  } catch (error) {
    logger.warn(`invalid fragment ID ${req.params.id}`);
    res.status(404).json(createErrorResponse(404, error.message));
  }
};
