import Im from "immutable"
import React from "react"
import PropTypes, { string } from "prop-types"
import { stringify } from "core/utils"

export default class AuthenticationTag extends React.Component {
  static propTypes = {
    oas3Selectors: PropTypes.func.isRequired,
    layoutSelectors: PropTypes.object.isRequired,
    layoutActions: PropTypes.object.isRequired,

    getConfigs: PropTypes.func.isRequired,
    getComponent: PropTypes.func.isRequired,

    specUrl: PropTypes.string.isRequired,

    children: PropTypes.element,
  }
  
  render () {
    let {
        getComponent,
        getConfigs,
        specSelectors,
        layoutSelectors,
        layoutActions,
        oas3Selectors,
    } = this.props

    const OperationTag = getComponent("OperationTag")
    const Markdown = getComponent("Markdown", true)
    const Curl = getComponent("curl")
    const ModelExample = getComponent("modelExample")
    const HighlightCode = getComponent("highlightCode")
    const ContentType = getComponent("contentType")

    let audience = window.location.origin.endsWith("alluvial.finance") ? window.location.origin : "https://api.dev.alluvial.finance"

    let markdown = `
This is the OAuth 2.0 grant that server processes use to access an API. 
    
Use this endpoint to directly request an Access Token by using your Client's credentials (Client ID + Client Secret).

Once obtained Access Token can be used to access API resources.

For more information about Client Credentials Flow, see [OAuth 2.0 RFC 6749, section 4.4](https://www.rfc-editor.org/rfc/rfc6749#section-4.4)
`

    const authURL = "https://auth.alluvial.finance/oauth/token"

    let requestSchema = {
      properties: {
        audience: {
            description: `The unique identifier of the target API you want to access. Use "${audience}"`,
            type: "string"
        },
        grant_type: {
            description: `Denotes the flow you are using. For Client Credentials use "client_credentials"`,
            type: "string"
        },
        client_id: {
          description: "Your application's Client ID.",
          type: "number"
        },
        client_secret: {
          description: "Your application's Client Secret.",
          type: "string"
        },
      },
      type: "object",
      description: "Get Access Token request body"
    }

    let requestExample = {
      audience:audience,
      grant_type: "client_credentials",
      client_id: "<YOUR_CLIENT_ID>",
      client_secret: "<YOUR_CLIENT_SECRET>"
    }

    const body = JSON.stringify({
      audience: audience,
      grant_type: "client_credentials",
      client_id: "<YOUR_CLIENT_ID>",
      client_secret: "<YOUR_CLIENT_SECRET>"
    }, null, 2)

    let curlReq = {
      url: authURL,
      method: "POST",
      body,
      headers: {
        "content-type": "application/json"
      }
    }

    let responseSchema = {
      properties: {
        access_token: {
            description: "Access Token to access API ressources (JWT)",
            type: "string"
        },
        scope: {
            description: "Scopes that have been provided on the API",
            type: "string"
        },
        expires_in: {
          description: "Access token expiration delay (in seconds)",
          type: "number"
        },
        token_type: {
          description: "Type of the Access Token",
          type: "string"
        },
      },
      type: "object",
      description: "Get Access Token response body"
    }

    let responseExample = {
      access_token: "eyJz93a...k4laUWw",
      scope: "read:eth-oracle...read:eth-operators",
      expires_in: 86400,
      token_type: "Bearer"
    }

    return (
        <OperationTag
            key={"operation-Authentication"}
            tag={"Authentication"}
            oas3Selectors={oas3Selectors}
            layoutSelectors={layoutSelectors}
            layoutActions={layoutActions}
            getConfigs={getConfigs}
            getComponent={getComponent}
            specUrl={specSelectors.url()}
        >
          <div className={"opblock opblock-get is-open"}>
            <div className="opblock-body">
              <div className="opblock-description-wrapper">
                <div className="opblock-description">
                  <Markdown source={markdown} />
                </div>
              </div>
              <div className="opblock-section-header">
                <h4>Request</h4>
              </div> 
              <div className="responses-inner">
                <div>
                  <Curl request={ Im.fromJS(curlReq) } getConfigs={ getConfigs } />
                  <div className="request-url">
                    <h4>Request URL</h4>
                    <pre className="microlight">{authURL}</pre>
                  </div>
                </div>
              </div>
              <div className="opblock-section-header">
                <h4 className={`opblock-title parameter__name required`}>Request body</h4>
                <label>
                <ContentType
                  value={"application/json"}
                  contentTypes={Im.List(["application/json"])}
                  onChange={(value) => {}}
                  className="body-param-content-type" 
                  ariaLabel="Request content type" />
                </label>
              </div>
              <div className="opblock-description-wrapper">
                <ModelExample 
                  getComponent={getComponent}
                  specSelectors={specSelectors}
                  schema={Im.fromJS(requestSchema)}
                  example={<div>
                    <HighlightCode className="example" getConfigs={ getConfigs } language={ "json" } value={ stringify(requestExample) } />
                  </div>}
                  getConfigs={getConfigs}
                  isExecute={false}
                  specPath={Im.fromJS(["authentication"])}
                  includeReadOnly = {true}
                  includeWriteOnly = {true}
                />
              </div>
              <div className="opblock-section-header">
                <h4>Response</h4>
              </div> 
              <div className="opblock-description-wrapper">
                <ModelExample 
                  getComponent={getComponent}
                  specSelectors={specSelectors}
                  schema={Im.fromJS(responseSchema)}
                  example={<div>
                    <HighlightCode className="example" getConfigs={ getConfigs } language={ "json" } value={ stringify(responseExample) } />
                  </div>}
                  getConfigs={getConfigs}
                  isExecute={false}
                  specPath={Im.fromJS(["authentication"])}
                  includeReadOnly = {true}
                  includeWriteOnly = {true}
                />
              </div>
            </div>
          </div>
       </OperationTag>
    )
  }
}
