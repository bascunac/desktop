import { IRepositoryState, RebaseConflictState } from '../lib/app-state'
import {
  ChooseBranchesStep,
  RebaseStep,
  ShowConflictsStep,
} from '../models/rebase-flow-state'
import { Branch } from '../models/branch'
import { TipState } from '../models/tip'
import { clamp } from './clamp'

export const initializeNewRebaseFlow = (state: IRepositoryState) => {
  const {
    defaultBranch,
    allBranches,
    recentBranches,
    tip,
  } = state.branchesState
  let currentBranch: Branch | null = null

  if (tip.kind === TipState.Valid) {
    currentBranch = tip.branch
  } else {
    throw new Error(
      'Tip is not in a valid state, which is required to start the rebase flow'
    )
  }

  const initialState: ChooseBranchesStep = {
    kind: RebaseStep.ChooseBranch,
    defaultBranch,
    currentBranch,
    allBranches,
    recentBranches,
  }

  return initialState
}

export const initializeRebaseFlowForConflictedRepository = (
  conflictState: RebaseConflictState
) => {
  const { targetBranch, baseBranch } = conflictState

  const initialState: ShowConflictsStep = {
    kind: RebaseStep.ShowConflicts,
    targetBranch,
    baseBranch,
  }

  return initialState
}

/**
 * Format rebase percentage to ensure it's a value between 0 and 1, but to also
 * constrain it to two significant figures, avoiding the remainder that comes
 * with floating point division.
 */
export function formatRebaseValue(value: number) {
  return Math.round(clamp(value, 0, 1) * 100) / 100
}
