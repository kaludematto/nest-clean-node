import { UseCaseError } from '@/core/errors/use-case-error'
// error class
export class NotAllowedError extends Error implements UseCaseError {
  constructor() {
    super('Not Allowed')
  }
}
