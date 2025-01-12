import { Exercise } from "../rules"

export type Storage = {
    exercises: Exercise[]
}

export const DEFAULT: Storage = { exercises: [] }

export const set: (store: Partial<Storage>, callback?: () => void) => void = chrome.storage.sync.set
export const get = (callback: (store: Storage) => void) => chrome.storage.sync.get(DEFAULT, callback as (store: unknown) => void)