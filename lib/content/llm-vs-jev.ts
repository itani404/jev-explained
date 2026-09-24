export const DEMO_TICKET =
  'Subject: Login failed. Message: I reset my password twice and still cannot get in.';

export const DEMO_LLM_REPLY =
  "Based on the ticket, this looks like it's related to the user's ability to access their account. " +
  'The password reset flow was attempted, which suggests an authentication issue. I would recommend ' +
  'routing this to the Account team, although if the reset emails are failing it could also be a ' +
  'Technical issue worth flagging.';

export const DEMO_JEV_REPLY = `{
  "choice": "account",
  "probabilities": {
    "account": 0.94,
    "technical": 0.05,
    "billing": 0.01
  }
}`;
