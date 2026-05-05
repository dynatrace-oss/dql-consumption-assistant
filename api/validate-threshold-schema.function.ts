export interface ValidationResult {
  valid: boolean;
  message?: string;
  constraintViolations?: ConstraintViolation[];
}
export interface ConstraintViolation {
  path?: string;
  message: string;
}

export interface SchemaContainer<T> {
  value: T;
  objectId?: string;
}

export interface SchemaPayload {
  global_threshold: number;
  custom_thresholds?: {
    group_name: string;
    threshold: number;
  }[];
}

/**
 * Validates the settings Threshold value for groups.
 */
// eslint-disable-next-line @typescript-eslint/require-await
export default async function validateThresholdSchema(
  payload: SchemaContainer<SchemaPayload>,
): Promise<ValidationResult> {
  const globalThreshold = payload.value.global_threshold;
  const customThresholds = payload.value.custom_thresholds ?? [];

  const constraintViolations: { path: string; message: string }[] = [];

  // global_threshold <= each custom threshold
  for (const custom of customThresholds) {
    if (globalThreshold > custom.threshold) {
      constraintViolations.push({
        path: `custom_thresholds.${custom.group_name}`,
        message: `global_threshold cannot be greater than custom threshold`,
      });
    }
  }

  const result: ValidationResult = {
    valid: constraintViolations.length === 0,
    message: `Container SchemaPayload payload is: ${JSON.stringify(payload)}`,
    constraintViolations: constraintViolations.length > 0 ? constraintViolations : undefined,
  };

  return result;
}
