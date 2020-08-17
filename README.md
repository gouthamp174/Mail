# MAIL


## OVERVIEW
This website is an Email service to send and receive emails. Users can create their account, view emails, compose emails and send them to other users.


# WEBSITE LAYOUT
This website is designed as a single-page application where most of the front-end user experience is handled using Javascript code. At the same time back-end support to save and retrieve emails are handled using Django web framework and it's internal database.

1. When users visit this website, they are initially redirected to a login page. For new users, it also has a link to register as first-time user. Existing users can login by providing their username and password.

2. Once logged in, users are taken to their homepage that includes a top menu bar. They can use this different items on this menu bar to navigate around the website.

3. Inbox: Users can click on 'Inbox' button on their homepage to be taken to their Inbox mailbox. It includes all emails that the users have received.
	 1. Emails are listed in reverse chronologically order from latest to earliest.
	 2. Each email provides a quick overview that includes sender's details, timestamp and subject.
	 3. Emails that are unread and marked with white background and bold text while emails that are read and marked with gray background.
	 4. On clicking an email, users are taken to corresponding email page that provides all information about it. Also the corresponding email is marked as read.

4. Compose: Users can click on 'Compose' button on their homepage to create a new email.
	 1. On this page, users can sender information, subject and body for their new email and finally send it using Submit button.
	 2. Once an email is sent successfully, users are redirected to their Sent mailbox.

5. Sent: Users can click on 'Sent' button on homepage to be taken to their Sent mailbox. It includes all emails that the user has sent to other users.
	 1. Users can click on any email to get more information regarding it.

6. Archived: Users can archive emails for later. Clicking on 'Archived' button on homepage takes them to Archived mailbox that list all emails that were previously saved by the user.
	 1. To archive an Inbox email, click on it in Inbox mailbox. Once it is opened, it shows an 'Archive' button at the top. Click on the button to archive the email.
	 2. To un-archive an email, click on it in Archived mailbox. Once it is opened, it shows an 'Unarchive' button at the top. Click on the button un-archive the email.

7. Reply: Users can reply to an email.
	 1. Clicking on an email in any mailbox will open it in another page.
	 2. It includes a 'Reply' button at the top. Clicking on it, takes the user to Compose page where fields are already pre-populated with information from the parent mail.
	 3. Users can edit and submit it to reply to the parent mail.

8. Logout: Clicking on this button on homepage will log out current user. Users will have to login once again to access their emails.


## VIDEO LINK
https://www.youtube.com/watch?v=mzBozAyAZBU

