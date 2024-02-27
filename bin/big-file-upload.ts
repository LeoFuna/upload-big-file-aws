#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { BigFileUploadStack } from '../lib/big-file-upload-stack';

const app = new cdk.App();
new BigFileUploadStack(app, 'BigFileUploadStack');
