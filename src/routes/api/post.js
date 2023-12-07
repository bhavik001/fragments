// src/routes/api/post.js
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const contentType = require('content-type');
const logger = require('../../logger');

module.exports = async (req, res) => {
  const type = contentType.parse(req.headers['content-type']).type;
  const ownerId = req.user;

  if (Buffer.isBuffer(req.body) === true && Fragment.isSupportedType(type)) {
    const fragment = new Fragment({ ownerId, type });

    try {
      await fragment.save();
      await fragment.setData(req.body);
      res.location(`${process.env.API_URL}/v1/fragments/${fragment.id}`);
      res.status(201).json(createSuccessResponse({ fragment: fragment }));
    } catch (error) {
      logger.error({ error }, 'post request failed', { ownerId });
      throw new Error({ error }, 'unable to save fragment');
    }
  } else {
    logger.error('post request failed', { ownerId });
    res.status(415).json(createErrorResponse(415, 'Content-Type is not supported'));
  }
};
