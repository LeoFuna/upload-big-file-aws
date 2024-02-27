const { S3 } = require('aws-sdk');

exports.handler = async (event) => {
  const bucket = process.env.BUCKET_NAME;
  const key = 'huge-file' + '.pdf';
  const expireSeconds = 60 * 5; // 5 minutes

  try {
    const url = new S3().getSignedUrl('putObject', {
      Bucket: bucket,
      Key: key,
      Expires: expireSeconds,
      ContentEncoding: 'base64',
      ContentType: 'application/pdf',
    });

    const getUrl = new S3().getSignedUrl('getObject', {
      Bucket: bucket,
      Key: key,
      Expires: expireSeconds,
    });
  
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ url, getUrl })
    }
  } catch (error) {
    console.error('Failed to generate presigned URL', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: error.message
      })
    }
  }

}
