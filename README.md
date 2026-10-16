Disclaimer:- This website is a non-commercial clone created for educational and demonstration purposes only. We are not affiliated with, endorsed by, or associated with [Original Website/Brand Name] or any of its subsidiaries. All trademarks, logos, and images used on this site are the property of their respective owners and are used here for illustrative purposes only. If you are a representative of the original brand and have concerns about this clone, please contact us and we will promptly take appropriate action.

## demo-build user portal

The `users/` pages and sign-in page are a synthetic-data demo. They read each signed-in user's profile from `users/{uid}` in Firestore. The dashboard uses `fullName`, `accountsBanking`, `accountsCredit`, and `accountsInvesting`; the other portal pages use their corresponding profile fields. Missing lists display as empty. Dashboard send-money, account-transfer, bill-payment, and global-transfer actions use trusted Cloud Functions to update demo account balances atomically and write records to `transactions`. Global transfers only update this demo ledger; they do not send funds through a real financial network. Other transfer and reward actions may remain simulations.

Before using the portal:

1. Configure `firebase.js` for a Firebase project you control for this demo, and enable Email/Password sign-in in Firebase Authentication.
2. Deploy [`firestore.rules`](./firestore.rules). These rules let users read their own profile and allow profile writes only for an authenticated admin with the `admin: true` custom claim. Users can read transaction records in which they are a participant; client-side transaction writes are denied.
3. Assign the `admin: true` custom claim to the administrator from a trusted environment using the Firebase Admin SDK; never set or accept admin claims from browser code. For example, in a private server-side script:

   ```js
   import { applicationDefault, initializeApp } from 'firebase-admin/app';
   import { getAuth } from 'firebase-admin/auth';

   const app = initializeApp({ credential: applicationDefault() });
   await getAuth(app).setCustomUserClaims('ADMIN_AUTH_UID', { admin: true });
   ```

   Use credentials for the demo project only, keep them out of this repository, then sign out and back in to refresh the administrator's ID token.
4. Deploy the callable backend with `firebase deploy --project YOUR_FIREBASE_PROJECT_ID --only functions,firestore:rules`. The functions use the Firebase Admin SDK to verify recipients and perform balance changes and transaction-record writes in a single Firestore transaction. Cloud Functions deployment requires a Firebase project with billing enabled.
5. Open `superadmin.html` as that administrator. The page creates Firebase Authentication accounts, stores the demo profile under the new user's UID, and can edit the Firestore profile later. Passwords are never stored in Firestore; changing a user's authentication email or password is a separate account-management operation.

Use synthetic names, contact details, account numbers, balances, and activity only. Do not enter real customer, financial, or identity data.

...