function getValidateTelephoneNumberFunction(telElement) {

	return () => {
		// source: https://www.digitalcrete.gr/gr/kodikoi-kliseon-statheron-tilefonon-ellados
		let validCodes = ["210", "2310", "2410", "2510", "2610", "2810", "2910", "22210", "22220", "22230", "22240", "22260", "22270", "22280", "22290", "22310", "22320", "22330", "22340", "22350", "22360", "22370", "22380", "22410", "22420", "22430", "22440", "22450", "22460", "22460", "22470", "22510", "22520", "22530", "22540", "22610", "22620", "22630", "22640", "22650", "22660", "22670", "22680", "22710", "22720", "22730", "22740", "22750", "22810", "22810", "22810", "22820", "22830", "22840", "22840", "22850", "22850", "22850", "22850", "22850", "22850", "22860", "22860", "22860", "22860", "22870", "22870", "22880", "22890", "22910", "22920", "22930", "22940", "22950", "22960", "22970", "22980", "22990", "23210", "23220", "23230", "23240", "23250", "23270", "23310", "23320", "23330", "23410", "23430", "23510", "23520", "23530", "23710", "23720", "23730", "23740", "23750", "23760", "23770", "23810", "23820", "23840", "23850", "23860", "23910", "23920", "23930", "23940", "23950", "23960", "23970", "23990", "24210", "24220", "24230", "24240", "24250", "24260", "24270", "24310", "24320", "24330", "24340", "24410", "24430", "24440", "24450", "24610", "24620", "24630", "24640", "24650", "24670", "24680", "24910", "24920", "24930", "24940", "24950", "25210", "25220", "25230", "25240", "25310", "25320", "25330", "25340", "25350", "25410", "25420", "25440", "25510", "25520", "25530", "25540", "25550", "25560", "25910", "25920", "25930", "25940", "26210", "26220", "26230", "26240", "26250", "26260", "26310", "26320", "26340", "26350", "26410", "26420", "26430", "26440", "26450", "26460", "26470", "26510", "26530", "26540", "26550", "26560", "26570", "26580", "26590", "26610", "26620", "26630", "26640", "26650", "26660", "26710", "26740", "26810", "26820", "26830", "26840", "26850", "26910", "26920", "26930", "26940", "26950", "26960", "27210", "27220", "27230", "27240", "27250", "27320", "27330", "27340", "27350", "27360", "27410", "27420", "27430", "27440", "27460", "27470", "27510", "27520", "27530", "27540", "27550", "27570", "27610", "27630", "27650", "27910", "27920", "27950", "27960", "27970", "28210", "28220", "28230", "28240", "28250", "28310", "28320", "28330", "28340", "28410", "28420", "28430", "28440", "28910", "28920", "28930", "28940", "28950", "28970", "37310"];

		// clear validity
		telElement.setCustomValidity("");

		// check basic validity using the `pattern` html attribute
		if (!telElement.checkValidity()) {
			telElement.setCustomValidity("Number must be 10 digits long and must start with '69' for mobile numbers or '2' otherwise.");
			return;
		}

		// check if the number is a landline number and it starts with a valid code
		userInput = telElement.value;

		if (userInput.startsWith("2") && (validCodes.every(code => !userInput.startsWith(code)))) {
			telElement.setCustomValidity("Number does not start with a valid landline code.");
			return;
		}

		telElement.setCustomValidity("");
	}
}

function getValidateBirthDateFunction(dateElement) {

	return () => {
		// clear validity
		dateElement.setCustomValidity("");

		// check if the age of the user is legal
		let todayDate = new Date();
		let custDate = new Date(dateElement.value);
		let diff = todayDate.getFullYear() - custDate.getFullYear();

		if (diff < 18 || diff > 112) {
			dateElement.setCustomValidity("User is under 18 or older than 112, so they cannot register.");
		} else {
			dateElement.setCustomValidity("");
		}
	}
}

function getValidatePasswordsFunction(pwElement, confirmPwElement) {

	return () => {
		// clear validity
		pwElement.setCustomValidity("");
		confirmPwElement.setCustomValidity("");

		// check if the passwords match
		if (pwElement.value != confirmPwElement.value) {
			pwElement.setCustomValidity("Passwords do not match.")
			confirmPwElement.setCustomValidity("Passwords do not match.")
		} else {
			pwElement.setCustomValidity("")
			confirmPwElement.setCustomValidity("")
		}
	}
}

function getValidateAddressFunction(addressElement) {

	return () => {

		let addressRegex = /^\w+?\s+\d+(?:-\d+?)?,\s*\d{5}\s+\w+?,\s*\w+?$/;

		// check if address matches the regex
		if (!addressElement.value.match(addressRegex)) {
			addressElement.setCustomValidity("Invalid address. Please match the placeholder text");
		} else {
			addressElement.setCustomValidity("");
		}
	}
}


window.onload = () => {
	let telephoneNumber = document.querySelector("#telephone_number");
	telephoneNumber.onchange = getValidateTelephoneNumberFunction(telephoneNumber);

	let birthDate = document.querySelector("#birth_date");
	birthDate.onchange = getValidateBirthDateFunction(birthDate);

	let password = document.querySelector("#password")
	let confirmPassword = document.querySelector("#password_conf")
	password.onchange = getValidatePasswordsFunction(confirmPassword, password);
	confirmPassword.onchange = getValidatePasswordsFunction(password, confirmPassword);

	let shippingAddress = document.querySelector("#shipping_address")
	shippingAddress.onchange = getValidateAddressFunction(shippingAddress);
}

