import AWS from 'aws-sdk';

export const S3_METHODS = {
    get: 'getObject',
    put: 'putObject'
};

export const getS3Method = (m) => S3_METHODS[m];

export async function getSignedUrl(bucket: any, key: string, method: string = S3_METHODS.get, contentType = undefined, versionId = undefined, expires = 300) {
    return new Promise((resolve, reject) => {
        const s3 = new AWS.S3();
        var params: any = {
            Bucket: bucket,
            Key: key,
            Expires: expires,
        };
        if (contentType) {
            params.ContentType = contentType;
        }
        if (versionId) {
            params.VersionId = versionId;
        }
        s3.getSignedUrl(method, params, function (err, url) {
            if (err) {
                reject(err);
            }
            else {
                resolve(url);
            }
        });
    });
}

export const copyFile = async (fromBucket, fromKey, toBucket, tokey) => {
    const s3 = new AWS.S3();
    var copyparams = {
        Bucket: toBucket,
        CopySource: `/${fromBucket}/${fromKey}`,
        Key: tokey
    };
    await s3.copyObject(copyparams).promise();
};

export const deleteObject = async (bucket, prefix) => {
    const s3 = new AWS.S3();
    await s3.deleteObject({
        Bucket: bucket,
        Key: prefix
    }).promise();
};

export const deleteFolder = async (bucket, dir) => {
    const s3 = new AWS.S3();
    const listParams = {
        Bucket: bucket,
        Prefix: dir
    };

    const listedObjects: any = await s3.listObjectsV2(listParams).promise();

    if (listedObjects.Contents.length === 0) return;

    const deleteParams: any = {
        Bucket: bucket,
        Delete: { Objects: [] }
    };

    listedObjects.Contents.forEach(({ Key }) => {
        deleteParams.Delete.Objects.push({ Key });
    });

    await s3.deleteObjects(deleteParams).promise();

    if (listedObjects.IsTruncated) await deleteFolder(bucket, dir);
};

export const getObjectContent = async (bucket, key, version) => {
    const s3 = new AWS.S3();
    const params: any = { Bucket: bucket, Key: key };
    if (version) params.VersionId = version;
    const res = await s3.getObject(params).promise();
    return res.Body.toString('utf-8');
};

export const putObjectContent = async (bucket, key, body) => {
    const s3 = new AWS.S3();
    const params = {Bucket: bucket, Key: key, Body: body};
    return await s3.putObject(params).promise();
}