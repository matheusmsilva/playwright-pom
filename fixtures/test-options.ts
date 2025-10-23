import { test as base, mergeTests, request } from '@playwright/test';
import { test as pageObjectFixture } from './pom/page-object-fixture';
import { test as apiRequestFixture } from './api/api-request-fixture';

const test = mergeTests(pageObjectFixture, apiRequestFixture);

const expect = base.expect;
export { test, expect, request };
