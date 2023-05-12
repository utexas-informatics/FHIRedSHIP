const logger = require('../config/logger');
const fileupload = require('../models/fileupload');

var save = async function (data) {
  logger.info(
    `fileupload : service  : save : received request` + JSON.stringify(data)
  );
  try {
    const fileuploadResponse = await fileupload.create(data);
    if (fileuploadResponse) {
      return fileuploadResponse;
    }
    throw new Error(`Error while creating fileupload`);
  } catch (e) {
    logger.error(`fileupload : service : save : Error : ${e}`);
    throw e;
  }
};

var get = async function (req) {
  logger.info(
    `fileupload : service  : get : received request` 
  );
  try {
    const fileuploadResponse = await fileupload
      .find({ linking: req.query.linking, isDeleted: { $ne: true } });

    if (fileuploadResponse) {
      return fileuploadResponse;
    }
    throw new Error(`Error while getting file`);
  } catch (e) {
    logger.error(`fileupload : service : get Files : Error : ${e}`);
    throw e;
  }
};

var remove = async function (req) {
  var _id=req.query.id;
  logger.info(
    `fileupload : service  : get : received request` 
  );
  try {
     const fileuploadResponse = await fileupload.findOneAndUpdate(
          {
            _id: _id,
          },

          {
            $set: {
              isDeleted: true,
            },

            updatedAt: new Date(),
          },

          { new: true }
        );

    if (fileuploadResponse) {
      return fileuploadResponse;
    }
    throw new Error(`Error while getting file`);
  } catch (e) {
    logger.error(`fileupload : service : get Files : Error : ${e}`);
    throw e;
  }
};

module.exports.remove = remove;
module.exports.get = get;
module.exports.save = save;