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
  ExtensionDefinition,
  createExtensionBlueprint,
  createExtensionDataRef,
} from '@backstage/frontend-plugin-api';
import {
  CustomFieldExtensionSchema,
  CustomFieldValidator,
  FieldExtensionComponentProps,
} from '../../extensions';

export type FormFieldExtensionData<
  TReturnValue = unknown,
  TUiOptions = unknown,
> = {
  fieldName: string;
  component: (
    props: FieldExtensionComponentProps<TReturnValue, TUiOptions>,
  ) => JSX.Element | null;
  validation?: CustomFieldValidator<TReturnValue, TUiOptions>;
  schema?: CustomFieldExtensionSchema;
};

const formFieldExtensionDataRef =
  createExtensionDataRef<FormFieldExtensionData>().with({
    id: 'scaffolder.form-field',
  });

const FormFieldBlueprint = createExtensionBlueprint({
  kind: 'scaffolder-form-field',
  attachTo: { id: 'page:scaffolder', input: 'form-fields' },
  output: [formFieldExtensionDataRef],
  config: {
    schema: {
      path: z => z.string().optional(),
    },
  },
  *factory({
    fieldName,
    component,
    validation,
    schema,
  }: FormFieldExtensionData<any, any>) {
    yield formFieldExtensionDataRef({
      fieldName,
      component,
      validation,
      schema,
    });
  },
});

/**
 * Creates extensions that are Field Extensions for the Scaffolder
 *
 * @public
 */
export function createFormField<TInput, TProps>(opts: {
  name: string;
  params: FormFieldExtensionData<TInput, TProps>;
}): ExtensionDefinition {
  return FormFieldBlueprint.make({
    name: opts.name,
    params: opts.params,
  });
}
