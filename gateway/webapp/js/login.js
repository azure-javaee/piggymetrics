/**
 * Registration form
 */

$('#signup').submit(function(e) {

    e.preventDefault();

    var username = $("input[id='backloginform']").val();
    var password = $("input[id='backpasswordform']").val();

    if (username.length < 3 || password.length < 6) {
        alert("Username must be at least 3 characters and password - at least 6. Be tricky!");
        return;
    }

    $.ajax({
        url: '/api/accounts/',
        datatype: 'json',
        type: "post",
        contentType: "application/json",
        data: JSON.stringify({
            username: username,
            password: password
        }),
        success: function (data) {

            requestOauthToken(username, password);
            initAccount(getCurrentAccount());

            $('#registrationforms, .fliptext, #createaccount').fadeOut(300);
            $('#mailform').fadeIn(500);
            setTimeout(function(){ $("#backmailform").focus() }, 10);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            if (xhr.status == 400) {
                alert("Sorry, account with the same name already exists.");
            } else {
                alert("An error during account creation. Please, try again.");
            }
        }
    });
});

/**
 * E-mail form
 */

$('#mail').submit(function(e) {

	e.preventDefault();

    var email = $("input[name='usermail']").val();

	if (email) {
        $.ajax({
            url: 'notifications/recipients/current',
            datatype: 'json',
            type: 'put',
            contentType: "application/json",
            data: JSON.stringify({
                email: email,
                scheduledNotifications: {
                    "REMIND": {
                        "active": true,
                        "frequency": "MONTHLY"
                    }
                }
            }),
            headers: {'Authorization': 'Bearer ' + getOauthTokenFromStorage()},
            async: true,
            success: function () {
                setTimeout(initGreetingPage, 200);
                setTimeout(function(){ $('#backmailform').val(''); $("#lastlogo").show(); }, 300);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                if (xhr.status == 400) {
                    alert("Sorry, it seems your email address is invalid.");
                } else {
                    alert("An error during saving notifications options");
                }
            }
        });
	}
});

/**
 * Login
 */

function login() {

	$("#piggy").toggleClass("loadingspin");
	$("#secondenter").hide();
	$("#preloader, #lastlogo").show();

    var username = $("input[id='frontloginform']").val();
    var password = $("input[id='frontpasswordform']").val();

    if (requestOauthToken(username, password)) {

        initAccount(getCurrentAccount());

        var userAvatar = $("<img />").attr("src","images/userpic.jpg");
        $(userAvatar).load(function() {
            setTimeout(initGreetingPage, 500);
        });
    } else {
        $("#preloader, #enter, #secondenter").hide();
        flipForm();
        $('.frontforms').val('');
        $("#frontloginform").focus();
        alert("Something went wrong. Please, check your credentials");
    }
}

/**
 * Logout
 */

function logout() {
    removeOauthTokenFromStorage();
    location.reload();
}

$("#skipmail").bind("click", function(){
    $("#lastlogo").show();
    setTimeout(initGreetingPage, 300);
});

/**
 * Login form effects
 */

function initialShaking(){
	autoShake();
	setTimeout(autoShake, 1900);
}

function autoShake() {
	$("#piggy").toggleClass("auto-shake");
}

function OnHoverShaking() {
	hoverShake();
	setTimeout(hoverShake, 1700);
}

function hoverShake() {
	$("#piggy").toggleClass("hover-shake");
}

function toggleInfo() {
	$("#infopage").toggle();
}

function flipForm() {
	//$("#cube").toggleClass("flippedform");
    $("#side1").toggle();
    $("#side3").toggle()
	$("#frontpasswordform").focus();
}

$("#piggy").on("click mouseover", function(){
	if ($(this).hasClass("skakelogo") === false && $(this).hasClass("hover-shake") === false) {
		OnHoverShaking();
	}
});

$(".fliptext").bind("click", function(){
	setTimeout( function() { $("#plusavatar").addClass("avataranimation"); } , 1000);
	$("#flipper").toggleClass("flippedcard");
});

$(".flipinfo").on("click", function() {
	$("#flipper").toggleClass("flippedcardinfo");
	toggleInfo();
});

$(".frominfo, #infotitle, #infosubtitle").on("click", function() {
	$("#flipper").toggleClass("flippedcardinfo");
	setTimeout(toggleInfo, 400);
});

$("#enter").on("click", function() {flipForm()});
$("#secondenter").on("click", function() {login()});

$("#frontloginform").keyup(function (e) {
	if( $(this).val().length >= 3 ) {
		$("#enter").show();
		if (e.which == 13) {
			flipForm();
			$("#enter").hide();
		}
		return;
	} else {
		$("#enter").hide();
	}
});

$("#frontpasswordform").keyup(function(e) {
	if ( $(this).val().length >= 6) {
		$("#secondenter").show();
		if(e.which == 13) {
			$(this).blur();
            login();
		}
		return;
	} else {
		$("#secondenter").hide();
	}
});