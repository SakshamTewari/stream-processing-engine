/*
client
  ↓
API
  ↓
validator
  ↓
queue
  ↓
worker
*/

/*
Future scope:

zod
schema registry
JSON schema
runtime typing
versioned contracts
*/

export interface EventValidator<T = any> {
    validate(event: T): boolean;
}