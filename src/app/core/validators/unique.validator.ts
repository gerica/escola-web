import { FormArray } from "@angular/forms";

const countDuplicates = (arr: any[], field: string) => {
  const count = arr
    .filter(i => !!i[field])
    .reduce((a, b) => ({ ...(a[field] || a), [b[field] || b]: (a[b[field] || b] || 0) + 1 }), {});
  return Object.keys(count).filter(k => count[k] > 1);
};

export const uniqueValidator = (controlName: string) => {
  return (formArray: FormArray) => {
    const duplicates = countDuplicates(formArray.value, controlName);
    return duplicates.length ? { unique: true } : null;
  };
};
