type BeFeValueMap = [string, string][]

// mappings are split for better clarity

const therapistFeBeMap: BeFeValueMap = [
   ['free_from', 'freeFrom'],
   ['therapy_types', 'therapyTypes'],
   ['postal_code', 'postalCode'],
   ['call_times', 'callTimes'],
   ['therapist_id', 'therapistID'],
]

const userFeBeMap: BeFeValueMap = [['call_precaution_time', 'callPrecautionTime']]

const addressFeBeMap: BeFeValueMap = [['street_number', 'streetNumber']]

const subscriptionFeBeMap: BeFeValueMap = [['subscription_id', 'ssubscriptionID']]

const allMaps: BeFeValueMap = [...therapistFeBeMap, ...userFeBeMap, ...addressFeBeMap, ...subscriptionFeBeMap]

/**
 * Remap object key names from fronted to values used by DBs tables and vice versa
 * @param input Object of which key identifier are to be renamed
 * @param map Mapping key to be renamed and new key name
 * @returns remapped Object
 */
export function remapKeys(input: any | any[], feToBe = true): any {
   const fromIndex = feToBe ? 1 : 0
   const toIndex = feToBe ? 0 : 1

   // ensure that deeper objects are correctly mapped
   if (Array.isArray(input)) {
      input.forEach((item) => {
         remapKeys(item, feToBe)
      })
   } else {
      // check if input has key contained in map.
      allMaps.forEach((pair) => {
         if (input[pair[fromIndex]] !== undefined) {
            input[pair[toIndex]] = input[pair[fromIndex]]
            delete input[pair[fromIndex]]
         }
      })
   }

   return input
}
