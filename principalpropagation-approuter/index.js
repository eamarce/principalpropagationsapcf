var approuter = require('@sap/approuter');
var axios = require('axios');
var FormData = require('form-data');

var ar = approuter();

const oVCAP_SERVICES = JSON.parse(process.env.VCAP_SERVICES);
const oConnectivityServiceCredentials = oVCAP_SERVICES.connectivity[0].credentials;

// Intercept requests going to /sap route (backend call) to add JWT Exchange Token
 ar.beforeRequestHandler.use('/sap', async function myMiddleware(req, res, next) {

    if (req.url.indexOf("/sap") > -1) {   /// Review the route contains /sap TODO: Can be extended to use regular expression
        try {

            var oAuthorization = JSON.parse(req._passport.session.user);   // Obtain Authorization object from request
            // The original JWT token can be found at oAuthorization.token.accessToken;  

            /// Make the post call according to the documentation so we can obtain JWT Exchange Token
            var params = new URLSearchParams();
            params.append('client_id', oConnectivityServiceCredentials.clientid);
            params.append('client_secret', oConnectivityServiceCredentials.clientsecret);
            params.append('grant_type', 'urn:ietf:params:oauth:grant-type:jwt-bearer');
            params.append('token_format', 'jwt');
            params.append('response_type', 'token');
            params.append('assertion', oAuthorization.token.accessToken);  /// Send original JWT token to connectivity service

            var response = await axios({
                method: "post",
                url: oConnectivityServiceCredentials.token_service_url + "/oauth/token",
                params: params,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/json"
                }
            });

            var userExchangeToken = response.data.access_token;

            req.headers('Proxy-Authorization', userExchangeToken);   // Add JWT Exchange token to the original request

            next();    /// Release the request with the new header

        } catch (error) {

            console.log(error);
            res.end(JSON.stringify(error));
        }
        
    } else {
        next();
        return;
    }


});
ar.start();