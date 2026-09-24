export type QuestionType = 'choice' | 'score' | 'boolean';

export type ChoiceAnswer = {
  type: 'choice';
  choice: string;
  probabilities?: Record<string, number>;
};

export type ScoreAnswer = {
  type: 'score';
  score: number;
  probabilities?: Record<string, number>;
};

export type BooleanAnswer = {
  type: 'boolean';
  probability: number;
};

export type JevAnswer = ChoiceAnswer | ScoreAnswer | BooleanAnswer;

export type EvaluateSuccess = {
  answer: JevAnswer;
  elapsedMs: number;
  inputTokens: number;
  cost: number;
};

export type ApiErrorCode =
  | 'playground_disabled'
  | 'rate_limited'
  | 'invalid_json'
  | 'invalid_request'
  | 'missing_api_key'
  | 'invalid_api_key'
  | 'card_required'
  | 'model_unavailable'
  | 'upstream_rate_limited'
  | 'timeout'
  | 'upstream_error';

export type ApiError = {
  error: { code: ApiErrorCode; message: string };
};
