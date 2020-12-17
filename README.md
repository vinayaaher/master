# Deploy React to AWS

![Deploy React to AWS](https://www.aaronwht.com/images/s3-build/deploy-react-to-aws.jpg)


### Overview
The code in this repository is configured to deploy to AWS S3 using AWS CodePipeline. The correlating server-side Node.js code may be found at https://github.com/aaronwht/aws-javascript-api.

[Contact me](https://www.aaronwht.com/contact-me) if you run into problems using this repo or tutorial.  

### Correlating Video Tutorial
https://www.youtube.com/watch?v=sgBKkug6qsE


### Running locally
Create an ```.env``` file in the root of your project as pictured below.  As a convention, ```.env``` files store environment variables and are not checked into code repositories as they often include sensitive, or environment-related, information.  This is typically done by including the ```.env``` file in your ```.gitignore``` file.

![.env file](https://www.aaronwht.com/images/s3-build/env-variables.png)

Create the variable ```REACT_APP_API``` and set it's value to ```http://localhost:8080/```. (include the suffix slash)  This will point to the correlating API endpoint specified above.

Run the below commands to install NPM packages locally and run the application.

```npm install```

```npm start```

The application should run locally.

The ```buildspec.yml``` file (code below) runs on the AWS build server.
```
version: 0.1
phases:
    install:
        commands:
        - npm install
        - npm run build
        - aws s3 cp build s3://$S3_BUCKET --recursive --exclude 'index.html'
        - aws s3 cp build/index.html s3://$S3_BUCKET
```

```npm install``` installs NPM packages on the AWS build server.

```npm run build``` creates a production version of the application on the AWS build server in the ```build``` folder.

```aws s3 cp build``` uses the AWS CLI (which is automatically installed on the build server) to recursively copy the contents of the ```build``` folder to the AWS S3 bucket using the environment variable ```$S3_BUCKET```.  This environment variable's value is used by the ```AWS build pipeline```.  

If this helped you consider making a one time $1-$3 donation to support me at [Patreon](https://www.patreon.com/aaronwht)
