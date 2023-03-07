const formValidate = (formSelector) => {
  const formElement = document.querySelector(formSelector);
  formElement.setAttribute("novalidate", "");

  //
  // Get the nodelist of inputs and map through them to get each input
  //

  const validateInputWrappers = (validatedForm) => {
    const inputWrappers = Array.from(
      validatedForm.querySelectorAll(".input-wrapper")
    ); // returns a node list of input wrappers

    inputWrappers.forEach((inputWrapper) => {
      validateSingleInputWrapper(inputWrapper);
    });
  };

  //
  // Object containing validation requirements
  //

  const requirementsValidation = [
    {
      attribute: "custommaxlength",
      isValid: (input) =>
        input.value &&
        input.value.length <=
          parseInt(input.getAttribute("custommaxLength"), 10),
      errorMessage: (input, label) =>
        `${label.textContent} must be shorter than ${input.minLength} characters`,
    },
    {
      attribute: "minlength",
      isValid: (input) =>
        input.value && input.value.length >= parseInt(input.minLength, 10),
      errorMessage: (input, label) =>
        `${label.textContent} must be at least ${input.minLength} characters`,
    },
    {
      attribute: "pattern",
      isValid: (input) => {
        const patternRegex = new RegExp(input.pattern);
        return patternRegex.test(input.value); // true or false
      },
      errorMessage: (input, label) => `${label.textContent} is not valid`,
    },
    {
      attribute: "required",
      isValid: (input) => input.value.trim() !== "",
      errorMessage: (input, label) => `${label.textContent} is required`,
    },
    {
      attribute: "customverify",
      isValid: (input) => {
        const verifySelector = input.getAttribute("customverify");
        const verifiedElement = formElement.querySelector(`#${verifySelector}`);
        return (
          verifiedElement && verifiedElement.value.trim() === input.value.trim()
        );
      },
      errorMessage: (input, label) => {
        const verifySelector = input.getAttribute("customverify");
        const verifiedElement = formElement.querySelector(`#${verifySelector}`);
        const verifiedLabel =
          verifiedElement.parentElement.querySelector("label");
        return `${label.textContent} should match ${verifiedLabel.textContent}`;
      },
    },
  ];

  //
  // Function validating every input
  //

  const validateSingleInputWrapper = (inputWrapper) => {
    const label = inputWrapper.querySelector("label");
    const input = inputWrapper.querySelector("input");
    const errorWraper = inputWrapper.querySelector("span");

    let inputWrapperError = false;
    for (const requirements of requirementsValidation) {
      if (
        input.hasAttribute(requirements.attribute) &&
        !requirements.isValid(input)
      ) {
        errorWraper.textContent = requirements.errorMessage(input, label);
        input.style.borderColor = "#d33c3c";
        inputWrapperError = true;
      }

      if (!inputWrapperError) {
        errorWraper.textContent = "";
        input.style.borderColor = "var(--green-primary)";
      }
    }
  };

  //
  // Call the function that validates every input when the form is submited
  //

  formElement.addEventListener("submit", (event) => {
    event.preventDefault();
    validateInputWrappers(formElement);
  });

  //
  // trigger the validation when going from one input to another
  //

  Array.from(formElement.elements).forEach((element) => {
    element.addEventListener("blur", (event) => {
      validateSingleInputWrapper(event.srcElement.parentElement);
    });
  });
};

formValidate("#form");
