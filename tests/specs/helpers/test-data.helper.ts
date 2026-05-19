/**
 * Test Data Helper
 * Central store for all test data constants and factory functions.
 * Keep selectors and page interactions OUT of this file.
 */

export const APP = {
  baseUrl: 'http://localhost:4200',
  title: 'Document Approval System',
} as const;

export const ROUTES = {
  login:           '/login',
  register:        '/register',
  dashboard:       '/dashboard',
  documents:       '/documents',
  createDocument:  '/documents/create',
  documentDetail:  (id: number | string) => `/documents/${id}`,
} as const;

export const DOCUMENT_CATEGORIES = [
  'Human Resources',
  'Finance',
  'IT',
  'Operations',
  'Legal',
] as const;

export type DocumentCategory = typeof DOCUMENT_CATEGORIES[number];

export const DOCUMENT_STATUSES = ['DRAFT', 'PENDING', 'APPROVED', 'REJECTED'] as const;
export type DocumentStatus = typeof DOCUMENT_STATUSES[number];

/** Factory: generate a unique document title using a timestamp */
export function generateDocTitle(prefix = 'Test Doc'): string {
  return `${prefix} ${Date.now()}`;
}

/** Sample document payloads for create-document tests */
export const SAMPLE_DOCUMENTS = {
  draft: {
    title: 'Draft Document Test',
    category: 'IT' as DocumentCategory,
    description: 'This is a draft document for automation testing.',
  },
  submitForApproval: {
    title: 'Approval Document Test',
    category: 'Finance' as DocumentCategory,
    description: 'This document will be submitted for approval.',
  },
  minimalRequired: {
    title: 'Minimal Required Fields',
    category: 'Human Resources' as DocumentCategory,
  },
} as const;
