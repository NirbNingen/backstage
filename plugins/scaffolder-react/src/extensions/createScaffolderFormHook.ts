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
import { AnyApiRef } from '@backstage/core-plugin-api';
import { JsonValue } from '@backstage/types';
import { z } from 'zod';

export type ScaffolderFormHookContext<TInput> = {
  input: TInput;
  setSecret: (key: string, value: JsonValue) => void;
};

export type ScaffolderFormHook<
  TDeps extends { [key in string]: AnyApiRef },
  TInput,
> = {
  version: 'v1';
  id: string;
  fn: (
    ctx: ScaffolderFormHookContext<TInput>,
    deps: { [key in keyof TDeps]: TDeps[key]['T'] },
  ) => Promise<void>;
};

/**
 * Method for creating secret collectors that can be used in the scaffolder form to collect secrets from the end user.
 * @public
 */
export function createScaffolderFormHook<
  TDeps extends { [key in string]: AnyApiRef },
  TInputSchema extends { [key in string]: (zImpl: typeof z) => z.ZodType },
  TInput = {
    [key in keyof TInputSchema]: z.infer<ReturnType<TInputSchema[key]>>;
  },
>(options: {
  id: string;
  schema?: {
    input?: TInputSchema;
  };
  deps: TDeps;
  fn: (
    ctx: ScaffolderFormHookContext<TInput>,
    deps: { [key in keyof TDeps]: TDeps[key]['T'] },
  ) => Promise<void>;
}): ScaffolderFormHook<TDeps, TInput> {
  return {
    ...options,
    version: 'v1',
  };
}
