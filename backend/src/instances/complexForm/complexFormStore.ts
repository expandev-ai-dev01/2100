/**
 * @summary
 * In-memory store for Complex Form feature.
 * Manages drafts and submissions.
 *
 * @module instances/complexForm/complexFormStore
 */

import { FormDraft, FormSubmission } from '@/services/complexForm/complexFormTypes';
import { COMPLEX_FORM_DEFAULTS } from '@/constants/complexForm';

class ComplexFormStore {
  private drafts: Map<string, FormDraft> = new Map();
  private submissions: Map<string, FormSubmission> = new Map();

  /**
   * Create or update a draft
   */
  saveDraft(draft: FormDraft): FormDraft {
    this.drafts.set(draft.id, draft);
    return draft;
  }

  /**
   * Get a draft by ID
   */
  getDraft(id: string): FormDraft | undefined {
    return this.drafts.get(id);
  }

  /**
   * Get draft by User ID (assuming one active draft per user for simplicity)
   */
  getDraftByUserId(userId: number): FormDraft | undefined {
    // In a real DB we would query by userId. Here we iterate.
    for (const draft of this.drafts.values()) {
      if (draft.userId === userId) return draft;
    }
    return undefined;
  }

  /**
   * Delete a draft
   */
  deleteDraft(id: string): boolean {
    return this.drafts.delete(id);
  }

  /**
   * Save a submission
   */
  saveSubmission(submission: FormSubmission): FormSubmission {
    this.submissions.set(submission.id, submission);
    return submission;
  }

  /**
   * Get a submission by ID
   */
  getSubmission(id: string): FormSubmission | undefined {
    return this.submissions.get(id);
  }

  /**
   * Clean up expired drafts
   */
  cleanupExpiredDrafts(): number {
    const now = new Date();
    let count = 0;
    for (const [id, draft] of this.drafts.entries()) {
      const lastSaved = new Date(draft.lastSaved);
      const diffDays = (now.getTime() - lastSaved.getTime()) / (1000 * 3600 * 24);
      if (diffDays > COMPLEX_FORM_DEFAULTS.DRAFT_EXPIRATION_DAYS) {
        this.drafts.delete(id);
        count++;
      }
    }
    return count;
  }
}

export const complexFormStore = new ComplexFormStore();
