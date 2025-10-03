import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  firstName = ('^[a-zA-Z]+$'); // Fixed typo
  onlyNumber = ('^[0-9]+$');
  fullName = ('^[a-zA-Z][a-zA-Z ]*$');
  email = ('^[a-zA-Z0-9][a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$'); // Updated regex
  mobileNo = ('^[6-9][0-9]{9}$'); // Mobile number validation (without country code)
  aadharCard = ('^[2-9][0-9]{11}$');
  password = ('^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[@$!%*?&#])[A-Za-z0-9@$!%*?&#]{8,20}$'); // Slight optimization
  latitude = ('^[+-]?(([1-8]?[0-9])(\.[0-9]{1,8})?|90(\.0{1,8})?)$');
  longitude = ('^[+-]?((([1-9]?[0-9]|1[0-7][0-9])(\.[0-9]{1,8})?)|180(\.0{1,8})?)$');
  pinCode = ('^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$'); // Simplified regex
  alphanumeric = ('^[^\s[\]`&._@#%*!+"\'/\\]a-zA-Z0-9.\\s]+$'); // 
  gstNo = '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$';
  name = '^[^\s0-9[\]`&._@#%*!+"\'/\\]a-zA-Z.\\s]+$'; // name validation (first, middle, last name)
  panCard = '[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}'; // PAN card regex


  marathiCharacterNumSpecialChar(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const marathiRegex = /^[\u0900-\u097F0-9\s\-(),./_]+$/; // Allow Marathi, numbers, spaces, and specific special chars
      if (control.value) {
        if (typeof control.value !== 'string') { return { invalidType: true } }// If the value is not a string
        if (!marathiRegex.test(control.value)) { return { marathiCharacters: true } } // Invalid characters found
      }
      return null; // Validation passed
    };
  }

  alphabetsWithSpaces(event: any) {
    this.noFirstSpaceAllow(event);
    const maskSeperator = new RegExp('^([a-zA-Z ])', 'g');
    return maskSeperator.test(event.key);
  }

  onlyAlphabetsWithOutSpace(event: any) {
    const maskSeperator = new RegExp('^([a-zA-Z])', 'g');
    return maskSeperator.test(event.key);
  }

  onlyAlphabets(event: any) {
    if (!this.noSpacesAtStart(event)) { return false }
    const maskSeperator = new RegExp('^([a-zA-Z])', 'g');
    return maskSeperator.test(event.key);
  }

  alphaNumeric(event: any) {
    const maskSeperator = new RegExp('^([a-zA-Z0-9])', 'g');
    return maskSeperator.test(event.key);
  }

  onlyDigits(event: any) { // numeric validation 
    const maskSeperator = new RegExp('^([0-9])', 'g');
    return maskSeperator.test(event.key);
  }

  onlyDigitsExcludeZeroAtStart(event: any) {
    const maskSeperator = new RegExp('^[1-9][0-9]*$', 'g')
    return maskSeperator.test(event.key);
  }

  digitsWithDec(event: any) {
    const maskSeperator = new RegExp('^([0-9.])', 'g');
    return maskSeperator.test(event.key);
  }

  acceptedOnlyNumbers(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) { event.preventDefault();}
  }

  isValidaonlyDigits(string: any) {
    let regex =  new RegExp(/^[0-9]{8,12}$/);
    if (string == null || string == '') return false;
    if (regex.test(string)) return true; else return false;
  }

  alphaNumericWithSpaces(event: any) { // AlphaNumeric 
    const maskSeperator = new RegExp('^([a-zA-Z0-9 ])', 'g');
    return maskSeperator.test(event.key);
  }

  alphaNumericWithSpacesAndSpecChars(event: any) {
    const maskSeperator = new RegExp('^([a-zA-Z0-9 (,)+-@#$_])', 'g');
    return maskSeperator.test(event.key);
  }

  alphaNumericWithSpacesAndWithoutSpecChars(event: any) {//....new
    const maskSeperator = new RegExp('^([a-zA-Z0-9 ])', 'g');
    return maskSeperator.test(event.key);
  }

  alphaNumericWithoutSpacesAndSpecChars(event: any) {
    const maskSeperator = new RegExp('^([a-zA-Z0-9(,)+-@#$_])', 'g');
    return maskSeperator.test(event.key);
  }

  alphaNumericWithSpacesDocComma(event: any) {
    const maskSeperator = new RegExp('^([a-zA-Z0-9 (,).])', 'g');
    return maskSeperator.test(event.key);
  }

  alphaNumericWithSlash(event: any) {
    const maskSeperator = new RegExp('^([a-zA-Z0-9 /])', 'g');
    return maskSeperator.test(event.key);
  }

  alphabetWithSpaceSpecl(event:any){
    const maskSeperator = new RegExp('^([a-zA-Z (-,)])', 'g');
    return maskSeperator.test(event.key);
  }

  noSpacesAtStart(event: any) { // for space 
    const maskSeperator = new RegExp('^[ ]+|[ ]+$', 'm');
    return !maskSeperator.test(event.key);
  }

  noFirstSpaceAllow(event: any) {  // for First Space Not Allow
    if (event.target.selectionStart === 0 && (event.code === 'Space')) {
      event.preventDefault();
    }
  }

  noSpaceAllow(event: any) {  // for All Space Not Allow
    if (event.code === 'Space') {
        event.preventDefault();
    }
  }

  unicodeMarathiWithSpecialChar(event: any) { // English & marathi with space and special char
    const maskSeperator = new RegExp('[^\u0900-\u0965? *%!/(,)&.+-_@#$0-9]+', 'm');
    return !maskSeperator.test(event.key);
  }

  unicodeMarathiValidation(event: any) { // English & marathi 
    const maskSeperator = new RegExp('[^\u0900-\u0965 ]+', 'm');
    return !maskSeperator.test(event.key);
  }

  alphaNumericWithSpaceSlash(event: any){
    if (!this.noSpacesAtStart(event)) { return false }
    const maskSeperator = new RegExp('^([a-zA-Z0-9/-])', 'g');
    return maskSeperator.test(event.key);
  }

  emailRegex(event: any) { // Email Validation
    if (!this.noSpacesAtStart(event)) return false; // First Space not Accept
    const inputValue = event.currentTarget.value;
    const key = event.key;
    if (inputValue.includes('..') && key === '.') return false; // Double dot (..) not allowed
    if (inputValue.includes('@') && key === '@') return false; // Double @ not allowed
    if (event.target.selectionStart === 0 && (key === '.' || key === '@')) return false; // Starting . or @ not allowed
    const maskSeparator = /^[a-zA-Z0-9.@_-]$/; // Allow only valid characters: A-Z, a-z, 0-9, ., @, _, -
    return maskSeparator.test(key);
  }

  singleDotAmount(event: any) {
    if (event.currentTarget.value.split('.').length - 1 == 1 && (event.keyCode == 46)) return false;  // double . not accept
    const maskSeperator = new RegExp('^([0-9.])', 'g');
    return maskSeperator.test(event.key);
  }

  isValidPanCardNo(panCardNo: any) {
    let regex = new RegExp(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/);
    if (panCardNo == null || panCardNo == '') return false;
    if (regex.test(panCardNo)) return true; else return false;
  }

  isValidAadharNo(aadharNo: any) {
    let regex = new RegExp(/^[2-9][0-9]{11}$/);
    if (aadharNo == null || aadharNo == '') return false;
    if (regex.test(aadharNo)) return true; else return false;
  }

  isValidGSTNo(gstNo: any) {
    let regex = new RegExp(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/);//29GGGGG1314R9Z6
    if (gstNo == null || gstNo == '') return false;
    if (regex.test(gstNo)) return true; else return false;
  }

  singleDot_RemoveFirstDotAmount(event: any) {
    if (event.target.selectionStart === 0 && (event.keyCode == 46)) return false;  // starting .Dot not accept
    return this.singleDotAmount(event);
  }

  noAllSpaceAllowEmail(event: KeyboardEvent) { //all space not allow for email
    if (event.key === ' ') {
      event.preventDefault(); // Prevent any space input
    }
  }

acceptOnlyNumbers(event: Event, control: FormControl, maxLength: number = 10) {
  const input = event.target as HTMLInputElement;

  // remove everything except digits
  let cleaned = input.value.replace(/[^0-9]/g, '');

  // remove leading spaces (just in case) 
  cleaned = cleaned.replace(/^\s+/, '');

  // apply max length
  if (cleaned.length > maxLength) {
    cleaned = cleaned.slice(0, maxLength);
  }

  control.setValue(cleaned, { emitEvent: false });
  input.value = cleaned;
}

// Block typing first space
blockFirstSpaceKey(event: KeyboardEvent) {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement;
  if (target.selectionStart === 0 && event.key === ' ') {
    event.preventDefault(); // stops first space from even appearing
  }
}

// Clean pasted spaces
noFirstSpaceAllowNew(event: Event, control: FormControl) {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement;
  let value = target.value;

  if (value.startsWith(' ')) {
    value = value.trimStart();
    control.setValue(value, { emitEvent: false });
    target.value = value;
  }
}

alphabetsWithSpacesNew(event: KeyboardEvent) {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement;

  // Allow control keys: Backspace, Delete, Arrow keys, Tab
  const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
  if (allowedKeys.includes(event.key)) return;

  // Block first space
  if (target.selectionStart === 0 && event.key === ' ') {
    event.preventDefault();
    return;
  }

  // Allow only alphabets and space
  const regex = /^[a-zA-Z ]$/;
  if (!regex.test(event.key)) {
    event.preventDefault();
  }
}



}
