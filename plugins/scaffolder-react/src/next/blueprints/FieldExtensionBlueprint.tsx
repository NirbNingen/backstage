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
  coreExtensionData,
  createExtensionBlueprint,
  createExtensionDataRef,
} from '@backstage/frontend-plugin-api';
import { FieldExtensionComponentProps } from '../../extensions';

const formFieldExtensionDataRef = createExtensionDataRef<{
  name: string;
  // component: (
  //   props: FieldExtensionComponentProps<TFieldReturnValue, TUiOptions>,
  // ) => JSX.Element | null;
  // validation?: CustomFieldValidator<TFieldReturnValue, TUiOptions>;
  // schema?: CustomFieldExtensionSchema;
}>().with({
  id: 'scaffolder.form-field',
});

/**
 * Creates extensions that are Field Extensions for the Scaffolder
 *
 * @public
 */
export const FormFieldBlueprint = createExtensionBlueprint({
  kind: 'scaffolder-form-field',
  attachTo: { id: 'page:scaffolder', input: 'form-fields' },
  output: [formFieldExtensionDataRef],
  config: {
    schema: {
      path: z => z.string().optional(),
    },
  },
  *factory({ name, component }: { name: T; component: T }) {
    yield formFieldExtensionDataRef({
      name,
    });
  },
});

FormFieldBlueprint.make({
  params: {
    name: 'my-field',
    component: () => null,
  },
});
