import UserProfileService from './UserProfileService.js';
import UserProfileRepository from './UserProfileRepository.js';

const repo = new UserProfileRepository(new UserProfileService());

const fieldMap = {
    height: ['height', 'height-inpt'],
    weight: ['weight', 'weight-inpt'],
    goalWeight: ['goal-weight', 'goal-weight-inpt'],
    dob: ['dob'],
    gender: ['gender', 'gender-inpt'],
    activity: ['activity-level', 'activity']
};

function getElement(id) {
    return document.getElementById(id);
}

function setValue(id, value) {
    const el = getElement(id);
    if (el && value !== undefined) el.value = value;
}

function gatherFormData() {
    const profile = {};
    for (const [key, ids] of Object.entries(fieldMap)) {
        for (const id of ids) {
            const el = getElement(id);
            if (el && el.value) {
                profile[key] = el.value;
                break;
            }
        }
    }
    return profile;
}

async function saveData() {
    const data = gatherFormData();
    await repo.saveProfile(data);
}

async function populateForm() {
    const data = await repo.getProfile();
    for (const [key, ids] of Object.entries(fieldMap)) {
        const val = data[key];
        for (const id of ids) {
            setValue(id, val);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    populateForm();
    for (const ids of Object.values(fieldMap)) {
        for (const id of ids) {
            const el = getElement(id);
            if (el) {
                el.addEventListener('change', saveData);
            }
        }
    }
});
