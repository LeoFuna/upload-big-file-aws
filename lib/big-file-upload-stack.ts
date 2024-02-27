import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class BigFileUploadStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'large-files', {
      versioned: false,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
      cors: [
        {
          allowedOrigins: ['*'],
          allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.PUT],
          allowedHeaders: ['*'],
        }
      ]
    })

    const lambdaToSignedUrl = new lambda.Function(this, 'presignedUrl', {
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'presigned-url.handler',
      environment: {
        BUCKET_NAME: bucket.bucketName,
      }
    });

    bucket.grantReadWrite(lambdaToSignedUrl);

    const api = new apigateway.RestApi(this, 'presignedUrlApi');

    const integration = new apigateway.LambdaIntegration(lambdaToSignedUrl);

    api.root.addCorsPreflight({
      allowOrigins: ['*'],
      allowMethods: ['GET'],
      allowHeaders: ['*']
    })
    api.root.addMethod('GET', integration);
  }
}
