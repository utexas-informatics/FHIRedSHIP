# FHIRedSHIP


A comprehensive and integrated information system to manage (a) social needs identified in clinical settings, (b) bi-directional information exchange between clinical providers and community-based organizations (CBOs) delivering social care, (c) integration in
clinical workflow and electronic health record (EHR), and (d) patients’ access, consent, and navigation using a mobile digital platform. This “closed loop” system, we have named FHIRed-SHIP, can be defined as one that helps a clinical provider to identify social needs of a patient, make referral to a social service organization that may address those social needs, and receive information back in their clinical EHR environment from the social service organization, thus closing the information loop of social service referrals in our community.

# FHIRedSHIP INSTALL

## Prerequisites
- Node.js version 16.15
- Angular version 16.1.0
- MongoDB

## Frontend Setup
1. Go to the `frontend` directory
2. Run `npm install`
3. Update the environment variables in `frontend/src/environments/environment.ts`:
   - `apiBaseUrl`: Server API URL
   - `socketUrl`: Server URL
   - `appUrl`: FHIRedSHIP App URL
   - `refDomain`: Referral URL
4. Run `ng serve` to start the app. It will be hosted at `http://localhost:4200`

## Server Setup
1. Create a `.env.development` file under the `server` directory and add the following environment variables:
   - `PORT`
   - `DB_USERNAME`
   - `DB_PASSWORD`
   - `DB_NAME`
   - `DB_HOST`
   - `DB_PORT`
   - `CORE_SERVICES_API_BASE_URL`
   - `SMTP_FROM`
   - `KC_URL`
   - `KC_SECRET`
   - `FHIR_API_BASE_URL`
   - `SMTP_REPLY_TO`
   - `DATAVANT_MATCH_LIMIT`
   - `DOMAIN`
   - `URNDOMAIN`
   - `RERERRAL_TOKEN`
   - `REFERRAl_URL`
   - `FHIREDAPP_URL`

2. Go to the `server` directory and run `npm install`

## MongoDB Setup
1. Unzip the `dump.zip` file in the `fhiredship` directory
2. Run the command `mongorestore` where the extracted dump is located
3. Manually create accounts in Keycloak and get the Keycloak IDs to replace the variable `<keycloakId>`

## Server Configuration
1. Update the `whitelist` variable in `server/app.js` to include all server URLs
2. Update the `baseUrl` and `domain` variables in `server/src/config/constants.js` with the appropriate values

## Run the Server
1. Run `npm start ./bin/www` in the `server` directory to start the server


