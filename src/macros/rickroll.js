module.exports = function rickroll(arc, cfn, stage) {

  let apigateway 
  for (let resource of Object.keys(cfn.Resources)) {
    if (cfn.Resources[resource].Type === 'AWS::Serverless::Api') {
      apigateway = resource
    }
  }

  cfn.Resources[apigateway].Properties.DefinitionBody.paths['/admin.php'] = {
    "get": {
      "responses": {
        "200": {
          "description": "200 response"
        }
      },
      "x-amazon-apigateway-integration": {
        "uri": {
          "Fn::Sub": "arn:aws:apigateway:${AWS::Region}:lambda:path/2015-03-31/functions/${GetAdminPhp.Arn}/invocations"
        },
        "responses": {
          "default": {
            "statusCode": "200",
            "contentHandling": "CONVERT_TO_TEXT"
          }
        },
        "passthroughBehavior": "when_no_match",
        "httpMethod": "POST",
        "contentHandling": "CONVERT_TO_TEXT",
        "type": "aws_proxy"
      }
    }
  }
  cfn.Resources.GetAdminPhp = {
      "Type": "AWS::Serverless::Function",
      "Properties": {
        "Handler": "index.handler",
        "CodeUri": "./src/macros",
        "Runtime": "nodejs12.x",
        "MemorySize": 1152,
        "Timeout": 5,
        "Environment": {
          "Variables": {
            "ARC_ROLE": {
              "Ref": "Role"
            },
            "ARC_CLOUDFORMATION": {
              "Ref": "AWS::StackName"
            },
            "ARC_APP_NAME": "init",
            "ARC_HTTP": "aws_proxy",
            "NODE_ENV": "staging",
            "SESSION_TABLE_NAME": "jwe"
          }
        },
        "Role": {
          "Fn::Sub": [
            "arn:aws:iam::${AWS::AccountId}:role/${roleName}",
            {
              "roleName": {
                "Ref": "Role"
              }
            }
          ]
        },
        "Events": {
          "GetAdminPhpEvent": {
            "Type": "Api",
            "Properties": {
              "Path": "/admin.php",
              "Method": "GET",
              "RestApiId": {
                "Ref": "Init"
              }
            }
          }
        }
      }
  }

  return cfn
}
