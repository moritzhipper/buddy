type BeFeValueMap = [string, string][];

// mappings are plite for better clarity
const settingsFeBeMap: BeFeValueMap = [
    ['appointment_precaution_time', 'appointmentPrecautionTime'],
    ['share_therapist_data', 'shareTherapistData'],
    ['remind_next_appointment', 'remindNextAppointment'],
    ['call_precaution_time', 'callPrecautionTime'],
    ['remind_appointment', 'remindAppointment']
];

const therapistFeBeMap: BeFeValueMap = [
    ['free_from', 'freeFrom'],
    ['therapy_types', 'therapyTypes'],
    ['postal_code', 'postalCode'],
    ['call_times', 'callTimes'],
    ['therapist_id', 'therapistID']
];

const notesAndGoalsFeBeMap: BeFeValueMap = [
    ['is_important', 'isImportant'],
    ['created_at', 'createdAt'],
    ['goal_id', 'goalID']
];

const appointmentFeBeMap: BeFeValueMap = [
    ['therapist_id', 'therapistID'],
    ['is_repeating', 'isRepeating']
];

const userFeBeMap: BeFeValueMap = [
    ['is_full_user', 'isFullUser']
]

const addressFeBeMap: BeFeValueMap = [
    ['street_number', 'streetNumber']
]

const allMaps: BeFeValueMap = [
    ...appointmentFeBeMap,
    ...notesAndGoalsFeBeMap,
    ...therapistFeBeMap,
    ...settingsFeBeMap,
    ...userFeBeMap,
    ...addressFeBeMap
];

/**
 * Remap object key names from fronted to values used by DBs tables and vice versa
 * @param input Object of which key identifier are to be renamed
 * @param map Mapping key to be renamed and new key name
 * @returns remapped Object
 */
export function remapKeys(input: any | any[], feToBe = true): any {
    const fromIndex = feToBe ? 1 : 0;
    const toIndex = feToBe ? 0 : 1;

    // ensure that deeper objects are correctly mapped 
    if (Array.isArray(input)) {
        input.forEach(item => {
            remapKeys(item, feToBe);
        });
    } else {
        // check if input has key contained in map. 
        allMaps.forEach((pair) => {
            if (input[pair[fromIndex]] !== undefined) {
                input[pair[toIndex]] = input[pair[fromIndex]];
                delete input[pair[fromIndex]];
            }
        });
    }

    return input;
}