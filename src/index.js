import request from 'request';
import gm from 'gm';
import AWS from 'aws-sdk';

const gim = gm.subClass({ imageMagick: true });

const handleErr = (err) => {
  if (err) {
    throw new Error(err.message);
  }
};

export const handler = (event, context, callback) => {  // eslint-disable-line import/prefer-default-export
  try {
    let fileName;
    if (event.fake) {
      fileName = event.fileName;
    } else {
      fileName = event.Records[0].s3.object.key;
    }

    const url = `https://gifs.bjacobel.com/${fileName}`;
    const req = request({
      url,
      gzip: true,
    }).on('error', (err) => handleErr(err));

    gim(req).selectFrame(0).quality(60).toBuffer('JPG', (gimErr, buffer) => {
      handleErr(gimErr);
      const upload = new AWS.S3.ManagedUpload({
        region: 'us-east-1',
        params: {
          Bucket: 'gifthumbs.bjacobel.com',
          Key: fileName,
          Body: buffer,
          ContentType: 'image/gif',
        },
      });
      upload.send((s3Err, data) => {
        handleErr(s3Err);
        callback(null, { data });
      });
    });
  } catch (err) {
    callback(JSON.stringify({ error: `${err.name}: ${err.message}`, event }, null, 2));
  }
};
