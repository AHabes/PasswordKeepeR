$(document).ready(function () {
  const MINIMUM_PASSWORD_LENGTH = 8;

  function makePassword(length, numbers, upperCase, LowerCase) {
    let result = "";
    let characters = "";
    const charactersLowerCase = 'abcdefghijklmnopqrstuvwxyz';
    const charactersUpperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charactersNumbers = '0123456789';

    if (LowerCase) {
      characters += charactersLowerCase; // characters = 'abcdefghijklmnopqrstuvwxyz'
    }
    if (upperCase) {
      characters += charactersUpperCase; // characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    }

    if (characters.length > 0) {
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) { // loop and sample characters based on password length
        result += characters.charAt(Math.floor(Math.random() * charactersLength));  // result = aBtReQzAeR // 10 characters long password
      }
    }
    if (numbers) {
      if (result === "") {
        for (let i = 0; i < length; i++) {
          // user doesn't want any lower case or upper case, so sampling the password from charactersNumbers='0123456789'
          let charIndex = Math.floor(Math.random() * charactersNumbers.length);
          result += charactersNumbers.charAt(charIndex);
        }
      } else {
        // in here, the password is already generated, and the result contains the password either in lower or upper or both
        //depending on user's choice.
        // here we randomly choose 1 or 3 characters form the password and replace them with numbers.
        let charactersLength = result.length < 10 ? 1 : 3;
        for (let i = 0; i < charactersLength; i++) {
          //  sample from the charactersNumbers = '0123456789'
          let index = Math.floor(Math.random() * charactersLength);
          let generatedNumber = charactersNumbers.charAt(index);  // generate number 2

          // pick a random character from our password, to replace it with the generatedNumbers
          let characterTobeReplaced = result.charAt(Math.round(Math.random() * result.length));  // index 3 from our result = aBtReQzAeR ===> R
          result = result.replace(characterTobeReplaced, generatedNumber);  // replace R with 2
        }
      }
    }
    return result;
  }

  const generateNewPassword = function (length, numbers, upperCase, lowerCase) {
    let regenerate = false;
    let result = "";
    do {
      let check = [];
      regenerate = false;
      result = makePassword(length, numbers, upperCase, lowerCase);
      console.log('result', result); // ====> aBtReQzAeR

      // password stored in result = aBtReQzAeR
      for (let x = 0; x < result.length; x++) { // go through the password characters one by one
        if (lowerCase) {
          if (result.charAt(x) >= 'a' && result.charAt(x) <= 'z')
            check.push("L"); // push L to signal that the password contains Lower case letter
        }
        if (upperCase) {
          if (result.charAt(x) >= 'A' && result.charAt(x) <= 'Z')
            check.push("U"); // push U to signal that the password contains Upper case letter
        }
        if (numbers) {
          if (result.charAt(x) >= '0' && result.charAt(x) <= '9') {
            check.push("N"); // push N to signal that the password contains a number
          }
        }
      }
      if ((lowerCase && !check.includes("L")) || (upperCase && !check.includes("U")) || (numbers && !check.includes("N"))) {
        regenerate = true;
      }
    } while (regenerate)
    return result;
  }

  const generatePassword = function () {
    const form = $("form");
    const table = $("table");

    form.submit(function (e) {

      // serialize the form inputs into JSON object
      const data = $(this).serializeArray();
      const passwordLength = $("input[name='passwordLength']");

      let numbers = false;
      let upperCase = false;
      let lowerCase = false;
      // parse the data array and get the checkbox values
      data.forEach(element => {
        if (element.value === 'numbers') {
          numbers = true;
        }
        if (element.value === 'upperCase') {
          upperCase = true;
        }
        if (element.value === 'lowerCase') {
          lowerCase = true;
        }
      })

      // error message CSS classes
      const errorShortPassword = $('.error-short-password');
      const errorNoCriteria = $('.error-no-criteria');

      // buttons
      const generatedPassword = $('.generated-password');
      const saveButton = $(`<tr><td></td><td><button id="saveButton" class='btn btn-danger'>Save</button></td></tr>`)
        .addClass("savePassword",);


      if (passwordLength.val() < MINIMUM_PASSWORD_LENGTH || (!lowerCase && !upperCase && !numbers)) {

        // display error if password length field is empty or less than 8 characters.
        if (errorShortPassword.length === 0 && passwordLength.val() < MINIMUM_PASSWORD_LENGTH) {
          const errorMessage = $(`<div>
          Password must be at least 8 characters long.
        </div>`).addClass("error-short-password");
          $('#notification').append(errorMessage);
        }
        // remove the error related to password length if the length > 8
        if (passwordLength.val() >= MINIMUM_PASSWORD_LENGTH)
          errorShortPassword.remove();

        // remove the error related to criterion selection if at least one criterion is selected
        if ((lowerCase || upperCase || numbers))
          errorNoCriteria.remove();

        if (errorNoCriteria.length === 0 && (!lowerCase && !upperCase && !numbers)) {
          const errorMessage = $(`<div>
          Please select at least one criterion.
        </div>`).addClass("error-no-criteria");

          $('#criteriaNotification').append(errorMessage);

          //  $("button[name='generate']").parent().parent().parent().append(errorMessage);
        }

        return false;
      } else {
        // remove any errors
        errorShortPassword.remove();
        errorNoCriteria.remove();

        // then generate the password
        let password = generateNewPassword(passwordLength.val(), numbers, upperCase, lowerCase);

        // make sure no previous password is present before displaying the new password
        if (generatedPassword.length === 0) {
          const passwordElement = $(`<tr><td></td><td>
          </td></tr>`).addClass("generated-password");

          $('#display').val(password)
          table.append(saveButton);
          table.append(passwordElement);

          $('#saveButton').on('click', function () {
            form[0].submit()
          });

        } else {
          $(".generated-password").remove();
          $('.savePassword').remove();
        }
        e.preventDefault();

      }
    });
  };

  generatePassword();
});