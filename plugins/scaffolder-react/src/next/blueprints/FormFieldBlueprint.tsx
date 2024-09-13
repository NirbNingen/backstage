/*
 * Copyright 2024 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  createExtensionBlueprint,
  createExtensionDataRef,
} from '@backstage/frontend-plugin-api';
import {
  CustomFieldValidator,
  FieldExtensionComponentProps,
} from '../../extensions';
import * as z from 'zod';
import { FieldSchema } from '../../utils';

export type FormFieldExtensionData<
  TReturnValue extends z.ZodType = z.ZodType,
  TUiOptions extends z.ZodType = z.ZodType,
> = {
  name: string;
  component: (
    props: FieldExtensionComponentProps<
      z.output<TReturnValue>,
      z.output<TUiOptions>
    >,
  ) => JSX.Element | null;
  validation?: CustomFieldValidator<
    z.output<TReturnValue>,
    z.output<TUiOptions>
  >;
  schema?: FieldSchema<z.output<TReturnValue>, z.output<TUiOptions>>;
};

const formFieldExtensionDataRef = createExtensionDataRef<
  () => Promise<FormField>
>().with({
  id: 'scaffolder.form-field-loader',
});

export const FormFieldBlueprint = createExtensionBlueprint({
  kind: 'scaffolder-form-field',
  attachTo: { id: 'api:scaffolder/form-fields', input: 'formFields' },
  dataRefs: {
    formFieldLoader: formFieldExtensionDataRef,
  },
  output: [formFieldExtensionDataRef],
  *factory(params: { field: () => Promise<FormField> }) {
    yield formFieldExtensionDataRef(params.field);
  },
});

export interface FormField {
  $$type: '@backstage/scaffolder/FormField';
}

export interface InternalFormField<
  TReturnValue extends z.ZodType = z.ZodType,
  TUiOptions extends z.ZodType = z.ZodType,
> extends FormField,
    FormFieldExtensionData<TReturnValue, TUiOptions> {}

/**
 * Creates extensions that are Field Extensions for the Scaffolder
 *
 * @public
 */
export function createFormField<
  TReturnValue extends z.ZodType,
  TUiOptions extends z.ZodType,
>(opts: FormFieldExtensionData<TReturnValue, TUiOptions>): FormField {
  return {
    $$type: '@backstage/scaffolder/FormField',
    ...opts,
  } as InternalFormField<TReturnValue, TUiOptions>;
}
