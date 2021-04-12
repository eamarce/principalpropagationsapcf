# SAP Cloud Foundry - MTA App Router extension for Principal Propagation.

A Node.JS example, extending the Application Router of an MTA application to achieve Principal Propagation in SAP Cloud Foundry. (On-premise via User Exchange Token flow).

The way it works is, the extended App Router intercepts a particular route (/sap) when a call is made. Then the App router logic follows the JWT exchange flow 
as described in the documentation to propagate the user information to the backend. 

To run the project:

* The principal propagation steps must be completed. https://help.sap.com/viewer/cca91383641e40ffbe03bdc78f00f681/Cloud/en-US/c84d4d0b12d34890b334998185f49e88.html
* Create a destination in SAP Cloud Foundry that uses Principal Propagation as the authentication mechanism. 
* Clone the repository in Business Application Studio.
* Run npm install in folders: one and principalpropagation-approuter 
* Modify the project's dummy service ( ZTESTPPSERVICE ) to point to the service you want to consume.
* Build and deploy the MTA application.
* Once deployed, you can view the Principal propagation functionality from the sample Fiori application at:
    - https://<<application-router-route-in-cloud-foundry>>/ppprincipal/index.html
    - The Fiori app would retrieve $metadata from the oData service using Principal Propagation.
    - To review the result, open the Network tab in the browser and review $metadata call to the backend.

Here is a link to the original post in SCN: https://blogs.sap.com/2021/04/12/extending-app-router-node.js-for-sap-principal-propagation-in-cloud-foundry-to-an-on-premise-system-via-user-exchange-token.
