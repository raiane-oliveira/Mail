# Mail

It's a project that simulates an email service where we have account register as well as login, and we can send, receive, archive and reply emails.
All the back-end part, coded with Django and Python, were already written by the CS50W course, leaving only the Front-end to the students.

This application uses the Single-Page Application (SPA) concept, where AJAX was used to call the API data, converted to JSON.
All the style was made with Bootstrap Framework.

![image](https://user-images.githubusercontent.com/100815627/217364157-07476943-1f1f-40a2-a391-43c1410aa45c.png)

**Demo Video**: https://www.youtube.com/watch?v=w9A2JlEvHcA

## 🚀 Techs

-   JavaScript
-   Python
-   Django
-   SQLite
-   Bootstrap
-   HTML

## 📩 Website Sections

-   `Inbox`: Shows all emails, read or unread, from the user.
-   `Compose`: part of the page with the mail composition form.
-   `Sent`: all sent emails from the user.
-   `Archive`: archive emails from the user.

## 🪸 Features

-   **Send email**: The user can send email by filling out the form in the `Compose` section.
It is allowed to send the same email to multiple email addresses at once.
A POST request is made by JavaScript on the same page and the mailbox is loaded.

-   **View email**: A GET request is made on the same page to the API and all the data of an email is returned. After it's clicked on, a PUT request is made
to update its data to read. When an email is read, it changes color in the inbox section.

-   **Archived and Unarchived**: allows the user to archive or unarchive emails. After that, the user's inbox is loaded. 
It does not work for the `Sent` section.

-   **Reply**: the user can reply a mail, where the compose form will be pre-filled with the content and timestamp of the previous mail.

## 📒 Learnings

-   How SPAs works in practice
-   API calls using AJAX
-   How to integrate APIs in the front-end
-   What the JSON format is and how to handle it
-   Request GET, POST and PUT
-   Bootstrap classes
-   Creating elements and Attribute manipulation using JS

## 🤝 Feedbacks

If you have opinions on how I might improve this application on the Front-end, please send me a message on
[Linkdin](https://www.linkedin.com/in/raiane-oliveira-dev/) or an <a href="mailto:raiane.oliveira404@gmail.com">email</a>.
I'll be happy to answer and learn more with you! ;) ❤️
