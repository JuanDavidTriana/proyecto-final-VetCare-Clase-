export const ROLES = Object.freeze({
    OWNER: 'owner',
    VET: 'vet',
    ASSISTANT: 'assistant',
    CLIENT: 'client'
});

export const ALL_ROLES = Object.values(ROLES);

export const STAFF = [ROLES.VET, ROLES.ASSISTANT, ROLES.OWNER];

export const STAFF_CREATABLE = [ROLES.VET, ROLES.ASSISTANT];

