document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // Adding a new event listener to submit compose email.
  document.querySelector('#compose-form').addEventListener('submit', submit_email);

  // By default, load the inbox
  load_mailbox('inbox');
});


// Check for any fetch() errros.
function checkErrors(response) {
  if (!response.ok) {
    throw Error(response.error);
  }
  return response;
}


// This function submits composed email.
function submit_email(event) {
  // Prevent default submit behavior.
  event.preventDefault();

  // Get mail attibutes.
  recipients = document.querySelector('#compose-recipients');
  subject = document.querySelector('#compose-subject');
  body = document.querySelector('#compose-body');

  // Post composed email.
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipients.value,
      subject: subject.value,
      body: body.value
    })
  })
  .then(checkErrors)
  .then(response => {
    // After sending email, load user's sent mailbox.
    document.querySelector('#sent').click();
  })
  .catch(error => console.log(error));
}


function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email-view').style.display = 'none';
  clean_email_view();

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}


function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  clean_email_view();

  // Show the mailbox name
  emailsView = document.querySelector('#emails-view');
  emailsView.innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Create a new email list.
  emailList = document.createElement('div');
  emailList.id = 'email-list';
  emailList.classList.add("list-group");
  emailsView.append(emailList);

  // Querying for latest emails in the mailbox.
  fetch(`/emails/${mailbox}`)
  .then(checkErrors)
  .then(response => response.json())
  .then(emails => {

    // For each email, create and add a new email Element block within email list.
    emails.forEach(email => {
      emailElement = document.createElement('button');
      emailElement.type = "button";
      emailElement.classList.add("list-group-item", "list-group-item-action", "m-1", "border", "rounded");

      // Mark if mail is read or unread.
      if (email.read) {
        emailElement.classList.add("read-mail");
      } else {
        emailElement.classList.add("unread-mail");
      }

      // Add event listener to view the email when it is clicked.
      emailElement.addEventListener('click', () => {
        view_email(email.id, mailbox);
      });

      // Create a header section within email element.
      emailHeader = document.createElement("div");
      emailHeader.classList.add("row");

      // Create sender element. Add to header section.
      emailSender = document.createElement("div");
      emailSender.classList.add("col", "col-sm-9");
      senderElement = document.createElement("div");
      senderElement.innerHTML = email.sender;
      emailSender.append(senderElement);
      emailHeader.append(emailSender);

      // Create timestamp element. Add to header section.
      emailTimestamp = document.createElement("div");
      emailTimestamp.classList.add("col", "col-sm-3");
      timestampElement = document.createElement("div");
      timestampElement.innerHTML = email.timestamp;
      emailTimestamp.append(timestampElement);
      emailHeader.append(emailTimestamp);

      // Create a body section within email element.
      emailBody = document.createElement("div");
      emailBody.classList.add("row");

      // Create subject element. Add to body section.
      emailSubject = document.createElement("div");
      emailSubject.classList.add("col");
      subjectElement = document.createElement("div");
      subjectElement.innerHTML = email.subject;
      emailSubject.append(subjectElement);
      emailBody.append(emailSubject);

      // Add header and body sections within email Element.
      emailElement.append(emailHeader);
      emailElement.append(emailBody);

      // Append new email Element to Email List.
      emailList.append(emailElement);
    });
  })
  .catch(error => console.log(error));
}


function clean_email_view() {
  // Email view should not expose previous email content when user
  // switches to another view (such as inbox or sent).
  // This function cleans different fields within email view.
  // Can also be used for initialization.
  document.querySelector('#email-options').innerHTML = '';
  document.querySelector('#email-sender').innerHTML = '';
  document.querySelector('#email-recipients').innerHTML = '';
  document.querySelector('#email-subject').innerHTML = '';
  document.querySelector('#email-timestamp').value = '';
  document.querySelector('#email-body').innerHTML = '';
}


function view_email(email_id, mailbox) {
  // Show email view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';

  // Mark email as read.
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: true
    })
  })
  .then(checkErrors)
  .then(response => {

    // Fetch and display email in email View.
    fetch(`/emails/${email_id}`)
    .then(checkErrors)
    .then(response => response.json())
    .then(email => {
      // Clean any pre-existing data within email-view.
      clean_email_view();

      // Add either archive or unarchive button to email Options.
      emailOptions = document.querySelector("#email-options");
      if (emailOptions !== null) {

        // Add reply option and it's event handler.
        replyOption = document.createElement("button");
        replyOption.id = "reply-option";
        replyOption.innerHTML = "Reply";
        replyOption.classList.add("btn", "btn-sm", "btn-outline-secondary");

        replyOption.addEventListener('click', () => {
          reply_email(email);
        })
        emailOptions.append(replyOption);

        // Add archive option and it's event handler.
        if (mailbox !== 'sent') {
          archiveOption = document.createElement("button");
          archiveOption.id = "archive-option";
          archiveOption.classList.add("btn", "btn-sm", "btn-outline-secondary");
          emailOptions.append(archiveOption);

          if (email.archived) {
            archiveOption.innerHTML = 'Unarchive';
            archiveOption.addEventListener('click', () => {
              archive_email(email.id, false);
            });
          } else {
            archiveOption.innerHTML = 'Archive';
            archiveOption.addEventListener('click', () => {
              archive_email(email.id, true);
            });
          }
        }
      }

      // Update fields in email view with queried email information.
      document.querySelector('#email-sender').value = email.sender;
      document.querySelector('#email-recipients').value = email.recipients.join(', ');
      document.querySelector('#email-subject').value = email.subject;
      document.querySelector('#email-timestamp').value = email.timestamp;
      document.querySelector('#email-body').innerHTML = email.body;
    })
    .catch(error => console.log(error));
  })
  .catch(error => console.log(error));
}


function archive_email(email_id, to_archive) {
  // Archive or Unarchive email based on 'to_archive' boolean flag.
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: to_archive
    })
  })
  .then(checkErrors)
  .then(response => {
    // After successfully archiving/un-archiving, load inbox view.
    document.querySelector('#inbox').click();
  })
  .catch(error => console.log(error));
}


function reply_email(email) {
  // This function handles replay email functionality.

  // Click on compose button to go to compose view.
  document.querySelector("#compose").click();

  // Add reply recipients.
  document.querySelector('#compose-recipients').value = email.sender;

  // Add reply subject. Checks and prepends "Re: " string it not already present.
  replyString = "Re: ";
  replySubject = email.subject;

  if (!email.subject.startsWith(replyString)) {
    replySubject = "".concat(replyString, email.subject);
  }
  document.querySelector('#compose-subject').value = replySubject;

  // Add reply body.
  replyBody = `On ${email.timestamp} ${email.sender} wrote:\n${email.body}`;
  document.querySelector('#compose-body').value = replyBody;
}
