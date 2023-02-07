document.addEventListener("DOMContentLoaded", function () {
    // Use buttons to toggle between views
    document
        .querySelector("#inbox")
        .addEventListener("click", () => load_mailbox("inbox"));
    document
        .querySelector("#sent")
        .addEventListener("click", () => load_mailbox("sent"));
    document
        .querySelector("#archived")
        .addEventListener("click", () => load_mailbox("archive"));
    document.querySelector("#compose").addEventListener("click", compose_email);

    // By default, load the inbox
    load_mailbox("inbox");
});

function compose_email(email = "") {

    // Show compose view and hide other views
    document.querySelector("#emails-view").style.display = "none";
    document.querySelector("#email-page").style.display = "none";
    document.querySelector("#compose-view").style.display = "block";

    // Saves fields form
    let composeRecipients = document.querySelector("#compose-recipients");
    let composeSubject = document.querySelector("#compose-subject");
    let composeBody = document.querySelector("#compose-body");

    // Clear out composition fields
    composeRecipients.value = "";
    composeSubject.value = "";
    composeBody.value = "";

    // Pre-fills the reply
    if (email.body) {
        composeRecipients.value = email.sender;

        // If already has a reply, doesn't add "Re: ", otherwise adds
        if (!email.subject.includes("Re:")) {
            composeSubject.value = `Re: ${email.subject}`;
        } else {
            composeSubject.value = email.subject;
        }

        // Adds information about each reply sent above the response
        let emailBodySplit = email.body.split("\n");
        const secondLastIndex = emailBodySplit.length - 2;
        const replySubmissionInformation = `On ${email.timestamp} ${email.sender} wrote:`;
        emailBodySplit.splice(secondLastIndex, 0, replySubmissionInformation);

        // Add formatted email reply
        composeBody.value = emailBodySplit.filter((item) => item).join("\n");
    }

    document.querySelector("#compose-form").onsubmit = () => {

        // Gets data from form
        let recipientsForm = composeRecipients.value;
        let subjectForm = composeSubject.value;
        let bodyForm = composeBody.value;

        // Send POST request to API
        fetch("/emails", {
            method: "POST",
            body: JSON.stringify({
                recipients: recipientsForm,
                subject: subjectForm,
                body: bodyForm,
            }),
        })
            .then((Response) => Response.json())
            .then((result) => {
                if (result.error) {
                    document.querySelector("#error-message").innerHTML =
                        result.error;
                } else {
                    load_mailbox("sent");
                }
            });

        // Stop the form's default behavior
        return false;
    };
}

function load_mailbox(mailbox) {

    // Show the mailbox and hide other views
    document.querySelector("#emails-view").style.display = "block";
    document.querySelector("#compose-view").style.display = "none";
    document.querySelector("#email-page").style.display = "none";

    // Show the mailbox name
    document.querySelector("#emails-view").innerHTML = `<h3>${
        mailbox.charAt(0).toUpperCase() + mailbox.slice(1)
    }</h3>`;

    // Send a request GET to show all emails in mailbox
    fetch(`/emails/${mailbox}`)
        .then((Response) => Response.json())
        .then((emails) => {
            emails.forEach((email) => {

                // Creates a div for each email
                const divEmail = document.createElement("div");
                divEmail.setAttribute("id", email.id);
                divEmail.className =
                    "emailBox shadow-sm d-flex justify-content-between align-items-center border p-3 mb-1";

                // Change background color if email was read
                if (email.read) {
                    divEmail.classList.add("bg-light");
                }

                // Changes text of button if it was archive or not
                let textBtn = email.archived ? "Unarchive" : "Archive";

                // Adds content to email boxs
                divEmail.innerHTML = `
						<div class="d-flex align-items-center main-content-email">
							<h5 class="m-0">${email.sender}</h5> 
							<p class="m-0 pl-4">${email.subject}</p>
						</div> 
						<div class="d-flex align-items-center" id="details-email">
							<small class="text-muted px-3">${email.timestamp}</small>
							<button class='btn btn-outline-secondary btn-archive'>${textBtn}</button>
						</div>
						`;
                divEmail.style.cursor = "pointer";

                // Adds div to emails view
                document.querySelector("#emails-view").append(divEmail);

                // Remove button of Sent mailbox
                if (mailbox === "sent") {
                    document.querySelectorAll(".btn-archive").forEach((btn) => {
                        btn.remove();
                    });
                }

                // Opens email if it was clicked
                document.getElementById(email.id).onclick = (event) => {
                    load_email(email, event);
                };
            });
        })
        .catch((error) => {
            document.querySelector("#error-message").innerHTML = error;
        });
}

function load_email(email, event) {

    // Finds what it was clicked
    const element = event.target;

    // If the user didn't click the archive button, it opens email page
    if (!element.className.includes("btn-archive")) {
        fetch(`/emails/${email.id}`)
            .then((Response) => Response.json())
            .then((email) => {
                
                // Show email page and hide the others
                document.querySelector("#email-page").style.display = "block";
                document.querySelector("#emails-view").style.display = "none";

                // Put the information about email in view
                document.querySelector("#email-page").innerHTML = `
                    <h5>From: <span class="font-weight-normal"">${email.sender}</span></h5>
                    <h5>To: <span class="font-weight-normal"">${email.recipients}</span></h5>
                    <h5>Subject: <span class="font-weight-normal"">${email.subject}</span></h5>
                    <h5>Timestamp: <span class="font-weight-normal"">${email.timestamp}</span></h5>
                    <button class="btn btn-outline-primary reply">Reply</button>
                    <hr>
                    <p>${email.body}</p>
				`;

                // Marks as read
                fetch(`/emails/${email.id}`, {
                    method: "PUT",
                    body: JSON.stringify({
                        read: true,
                    }),
                });

                // Allow reply emails
                document.querySelector(".reply").onclick = () => {
                    compose_email(email);
                };
            });
    }

    // Archive or unarchive email
    else {
        if (!email.archived) {
            fetch(`/emails/${email.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    archived: true,
                }),
            });
        } else {
            fetch(`/emails/${email.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    archived: false,
                }),
            });
        }

        // Reload the page
        window.location.reload();
    }
}
