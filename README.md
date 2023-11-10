# TAM UP!

Our customers/prospect will typically have a link to the portals for their xMS, from either their homepage or 1 page deep. The TAM UP! DB contains a list of all these links, for all accounts tracked in Salesforce.

With the TAM UP! DB we can discover patterns within the links that may track back to a given xMS vendor, and track that back to the given account. As a result, we may be able to tell that an account uses a given xMS.

## Accessing the TAM UP! DB

The TAM UP! DB is hosts as a GCP BigQuery dataset. It consists of 2 tables

### Website

| Name | Type | Description |
| --- | --- | ---|
| id | UUID | The key of the website. |
| name | String | The name of the customer/prospect as found in Salesforce. |
| accountId | String | The salesforces `accountID`. |
| visitedPages | String[] | A list of all pages that were visited to find external links. |
| createdAt | Date | The date of creation of this record __in the TAM UP! DB__. |
| updatedAt | Date | The date of the last update of this record in the TAM UP! DB. |

