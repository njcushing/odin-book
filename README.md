<a name="readme-top"></a>


<!-- Project Shields -->
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- Project Information Overview -->
<br />
<div align="center">
  <h3 align="center">Odin Book</h3>

  <p align="center">
    A social media application designed as part of The Odin Project's NodeJS course.
    <br />
    <br />
    <!-- <a href="https://github.com/othneildrew/Best-README-Template">View Live Demo</a> -->
  </p>
</div>



<!-- Table of Contents -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li>
      <a href="#usage">Usage</a>
      <ul>
        <li><a href="#account-creation-and-login">Account Creation and Login</a></li>
        <li><a href="#posts">Posts</a></li>
        <li><a href="#chats">Chats</a></li>
        <li><a href="#profile">Profile</a></li>
        <li><a href="#settings">Profile</a></li>
        <li>
          <a href="#customisation">Customisation</a>
          <ul>
            <li><a href="#changing-the-guest-account">Changing the Guest Account</a></li>
          </ul>
        </li>
      </ul>
    </li>
    <li><a href="#future-features">Future Features</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li>
      <a href="#credits">Credits</a>
      <ul>
        <li><a href="#stock-images">Stock Images</a></li>
      </ul>
    </li>
  </ol>
</details>



<!-- About the Project -->
## About the Project

![Overview](https://res.cloudinary.com/djzqtvl9l/image/upload/v1717156400/overview_ew416a.png)

This project was designed as part of The Odin Project's NodeJS course. It is a social media site with numerous features, including:
* <a href="#posts">Posts</a>, which can contain both text and images,
* <a href="#chats">Chats</a> with other users,
* A personal <a href="#profile">profile</a>, on which you can set a custom name, bio, profile image and theme, and which has individual 'tabs' for your posts, replies, likes, followed users and users following you,
* An information sidebar which displays recommended users, recent posts from your followed users and recent chat activity.

Also, by using a responsive layout, the application is compatible with a wide range of screen sizes!

<img src="https://res.cloudinary.com/djzqtvl9l/image/upload/v1717257883/mobile-layout_oujogp.png" alt="Mobile layout" style="width:190px;"/>

<p align="right">(<a href="#readme-top">Back to Top</a>)</p>



### Built With

[![TypeScript][TypeScript]][TypeScript-url]  
[![React][React.js]][React-url]  
[![NodeJS][Node.js]][NodeJS-url]  
[![MongoDB][MongoDB]][MongoDB-url]  

<p align="right">(<a href="#readme-top">Back to Top</a>)</p>



<!-- Getting Started -->
## Getting Started

If you want to get this project running yourself, please follow these steps.

### Prerequisites

* Install npm and NodeJS by following this [tutorial][npm-nodejs-install-tutorial-url]
* If you don't have one already, create a MongoDB account [here][mongodb-register-url]
    * Create a new MongoDB cluster, a tutorial for this can be found [here][mongodb-cluster-tutorial-url]
        * Make note of your new cluster's connection string - you will need this later
* Create a Cloudinary account [here][cloudinary-register-url]
    * Make a note of your account's cloud name, API key, and API secret - you will need these later

### Installation

1. Clone the repository
   ```sh
   git clone https://github.com/njcushing/odin-book.git
   ```
2. Install the project's dependencies
   ```sh
   npm install
   ```
3. Push the new local repository to GitHub
   ```sh
   git remote set-url origin http://github.com/your_username/your_repository
   git push origin main
   ```
4. Set up the application as an OAuth app (if you don't do this, users won't be able to log in using their GitHub account)
  * A tutorial for this can be found [here][github-oauth-tutorial-url]
  * Make note of the ClientID
  * Generate a client secret and make note of this
  * Set the 'Homepage URL' and 'Authorization callback URL' fields
5. Create a file for your environment variables in the top-level directory: `.env`
6. Inside `.env`, you will need the following environment variables:
  * `PORT` - The port on which you want your server to be open, e.g. - `3000`
  * `MONGO_URI` - The connection string for your MongoDB cluster
  * `AUTH_CLIENT_SECRET` - A password for creating JSONWebTokens
  * `GITHUB_CLIENT_ID` - The ClientID in your application's OAuth settings
  * `GITHUB_CLIENT_SECRET` - The generated client secret in your application's OAuth settings
  * `GITHUB_CALLBACK_URI` - The callback URL to redirect the user to when authorizing their GitHub account (should be  the same as the 'Authorization callback URL' field in your application's OAuth settings)
  * `GUEST_PASSWORD` - A password for the guest account
  * `VITE_SERVER_DOMAIN` - Your server's domain, e.g. - `"http://localhost:3000"`
  * `CLIENT_DOMAIN` - Your client's domain, e.g. - `"http://localhost:3000"` or `"http://localhost:5173"` (the client's domain will match the server's domain if you are serving the frontend as static assets from the server by running the application in dev mode using `npm run dev`)
  * `TRUSTED_DOMAINS` - An array containing the domains your server should trust, e.g. - `["http://localhost:5173"]`
  * `CLOUDINARY_NAME` - Your Cloudinary account's cloud name
  * `CLOUDINARY_API_KEY` - Your Cloudinary account's API key
  * `CLOUDINARY_API_SECRET` - Your Cloudinary account's API secret
7. Run the npm script for compiling and starting the backend and frontend applications
   ```sh
   npm run dev
   ```
8. Navigate to the server's domain in your chosen browser

You can also run the backend and frontend packages separately:
```sh
npm run watch:back
npm run watch:front
```  
If you choose to run the application this way, you will need to navigate to the client's domain in the browser.

<p align="right">(<a href="#readme-top">Back to Top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

### Account Creation and Login

When a user is trying to view the homepage without a valid token, they will automatically be redirected to the login page. Here, the user has a few login options:
* Using their account's credentials
* Using their GitHub account
* As a guest

When logged in as a guest, the user will not have access to most of the application's features; they will not be able to create posts, chats, follow/unfollow users, edit their account settings, etc. It exists only to provide a way of observing the application to those who do not wish to make an account.

![Login page](https://res.cloudinary.com/djzqtvl9l/image/upload/v1717156398/login_svvubw.png)

If the user wishes to create their own account, they can do so by clicking the 'Create Account' button, which will redirect the user to the account creation page. Here, a valid username, email and password much be entered (all of which must satisfy some regular expression pattern). Upon submission and successful account creation, the user will be redirected to the homepage.

![Account creation page](https://res.cloudinary.com/djzqtvl9l/image/upload/v1717156398/create-account_qr9nel.png)

<p align="right">(<a href="#readme-top">Back to Top</a>)</p>

### Posts

Posts can contain both text and images. To create a new post, a user must be on the homepage of the application, where other posts are displayed. At the bottom of the viewport there is a 'Create New Post' button which, when clicked, will open a modal where the user can both write text and select images from the filesystem. The content of the post will be displayed in a preview under the inputs so users can observe what their posts will look like before submission.

![Post creation modal](https://res.cloudinary.com/djzqtvl9l/image/upload/v1717156399/create-post-modal_em7nqt.png)

Posts can also be liked and replied to. When replying to a post, the same modal is opened as when creating a new post, as replies are actually just posts that have a 'replyingTo' field set to the id of the post being replied to.

Posts also have their own individual pages. When clicking the 'Likes' or 'Replies' on a post, it will redirect the user to a page with users who have liked the post, or a page containing posts in response to the selected post, respectively.

![Post replies](https://res.cloudinary.com/djzqtvl9l/image/upload/v1717156399/post-replies_jahrlr.png)
![Post likes](https://res.cloudinary.com/djzqtvl9l/image/upload/v1717156534/post-likes_eltj4q.png)

<p align="right">(<a href="#readme-top">Back to Top</a>)</p>

### Chats

Users can create new chats by navigating to the chats list, where a button at the bottom of the screen can be clicked to bring up a modal. This modal contains a search bar that can be used to search for other users by their account tag. The specified user(s) can be added to a list and all users will be added to the new chat on submission.

![Chat list](https://res.cloudinary.com/djzqtvl9l/image/upload/v1717156769/chat-list_ea0rmc.png)
![Create chat modal](https://res.cloudinary.com/djzqtvl9l/image/upload/v1717255885/create-chat-modal_ddiywd.png)

Currently, any user can be added to any chat; there is no requirement for those users to be followed by/following any other user. On successful chat creation, the user will be redirected to the new chat.

Users can send messages in the chat that, similar to posts, can contain both text and images. Users can also reply to existing messages in the chat, and any messages that are in response to another will display that message's content above the main content of the message. Users can also delete their own messages.

![Chat](https://res.cloudinary.com/djzqtvl9l/image/upload/v1717156770/chat-window_l67ibf.png)

Users can change the name of the chat by clicking the 'Edit' button next to the chat's name. By default, the name will be a compilation of the various users within the chat. The image of the chat can also be changed by clicking the image; this will bring up a modal where a new image can be uploaded.

![Update chat image modal](https://res.cloudinary.com/djzqtvl9l/image/upload/v1717156799/update-chat-image-modal_ouodsq.png)

Finally, users can add participants to the chat by clicking the button to the right of the chat's name. This will bring up a similar modal as the one used to create the chat; new users can be selected before submission.

<p align="right">(<a href="#readme-top">Back to Top</a>)</p>

### Profile

Every user has their own profile page that displays information about that user, including their display name, account tag, profile image, bio and header image. There are also five tabs below the user's main information section. These tabs can be clicked to display one of the following: the user's posts, replies, likes, followers and followed users.

If the user is observing another user's profile, a 'Follow'/'Unfollow' button will also be present, depending on whether they are currently following that user. If the user is observing their own profile, an 'Edit Profile' button will be present that, when clicked, will redirect the user to the settings page.

![Profile](https://res.cloudinary.com/djzqtvl9l/image/upload/v1717255963/profile_vlul4k.png)

<p align="right">(<a href="#readme-top">Back to Top</a>)</p>

### Settings

In the settings page, the user can select a category of settings, either 'Preferences' or 'Profile'. Here, the user can set their choice of theme, display name, bio and profile image.

![Profile settings](https://res.cloudinary.com/djzqtvl9l/image/upload/v1717255979/settings-profile_la8yyy.png)
![Themes](https://res.cloudinary.com/djzqtvl9l/image/upload/v1717257012/themes_mtyjso.png)

<p align="right">(<a href="#readme-top">Back to Top</a>)</p>

### Customisation

#### Changing the Guest Account

By default, the application will not have any accounts other than the guest account, which occupies the 'guest' account tag, and since account tags must be unique, this is the only tag that cannot be used for your own accounts. If you wish to use this tag, you need to edit some files to prevent the tag being taken by the automatically-generated guest account:

In `packages/backend/src/utils/createGuestAccount.ts`, change the following:
```js
const newUser = new User({
    type: "guest",
    accountTag: "guest",
    password: hashedPassword,
});
```  
by replacing "guest" with your desired tag.  

In `packages/backend/src/controllers/auth/login/index.ts`, change the following:
```js
const guestUser = await User.findOne({ accountTag: "guest" });
```
by replacing "guest" with your desired tag.

If you have already run the server application, the original guest account that uses the 'guest' tag by default will still exist in the database. To remove it, simply locate it in your MongoDB database and delete it manually.

<p align="right">(<a href="#readme-top">Back to Top</a>)</p>



<!-- Future Features -->
## Future Features

While I am satisfied with the current state of the application and what it is capable of, there are a few features I would like to add in future:

- [ ] Live updates (not needing to refresh the page to see new posts, messages etc.)
- [ ] More comprehensive 'Create Account' page
    - [ ] Set a custom display name
    - [ ] Set a custom profile image
- [ ] Add additional authentication methods (Facebook, Google, etc.)
- [ ] Additional post features
    - [ ] Add functionality to the 'Share' button
    - [ ] Users can edit their own posts
    - [ ] Users can delete their own posts
- [ ] Additional chat features
    - [ ] Authorised participants can remove, mute and assign 'roles' ('admin', 'moderator', 'guest') to others
    - [ ] Users can edit their own messages
    - [ ] A more advanced text editor
- [ ] Display images as a modal in their original resolution when clicking on them
- [ ] Fix image resolution when displayed at varying sizes
- [ ] Display 'popular' users (with many followers) in 'Recommended Users' tab in the absence of other recommendations
- [ ] Add 'sign out' button
- [ ] Add 'Notifications' tab to show users' replies to your posts
- [ ] Add a way to tag other users in posts

<p align="right">(<a href="#readme-top">Back to Top</a>)</p>



<!-- License -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">Back to Top</a>)</p>



<!-- Contact -->
## Contact

Niall Cushing - [LinkedIn][linkedin-url]

Project Link: [https://github.com/njcushing/odin-book][project-link]

<p align="right">(<a href="#readme-top">Back to Top</a>)</p>



<!-- Credits -->
## Credits

### Stock Images
* Photo by <a href="https://unsplash.com/@lachlanjdempsey?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Lachlan Dempsey</a> on <a href="https://unsplash.com/photos/man-in-middle-of-wheat-field-6VPEOdpFNAs?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
* Photo by <a href="https://unsplash.com/@peter_mc_greats?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Pietro De Grandi</a> on <a href="https://unsplash.com/photos/three-brown-wooden-boat-on-blue-lake-water-taken-at-daytime-T7K4aEPoGGk?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
* Photo by <a href="https://unsplash.com/@peter_mc_greats?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Pietro De Grandi</a> on <a href="https://unsplash.com/photos/three-brown-wooden-boat-on-blue-lake-water-taken-at-daytime-T7K4aEPoGGk?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
* Photo by <a href="https://unsplash.com/@aleskrivec?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Ales Krivec</a> on <a href="https://unsplash.com/photos/photo-of-green-grass-field-at-sunrise-4miBe6zg5r0?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
* Photo by <a href="https://unsplash.com/@leirenestrong?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Irene Strong</a> on <a href="https://unsplash.com/photos/mens-gray-crew-neck-shirt-v2aKnjMbP_k?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
* Photo by <a href="https://unsplash.com/@sickle?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Sergey Pesterev</a> on <a href="https://unsplash.com/photos/silhouette-of-mountains-covered-by-fogs-at-the-horizon-JV78PVf3gGI?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
* Photo by <a href="https://unsplash.com/@jeffreykeenan?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Jeffrey Keenan</a> on <a href="https://unsplash.com/photos/man-in-green-crew-neck-shirt-and-black-hat-pUhxoSapPFA?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
* Photo by <a href="https://unsplash.com/@marvelous?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Marvin Meyer</a> on <a href="https://unsplash.com/photos/person-scuba-diving-UpEv2kOnmCc?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
* Photo by <a href="https://unsplash.com/@j_erhunse?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Jeffery Erhunse</a> on <a href="https://unsplash.com/photos/man-in-white-shirt-standing-near-body-of-water-during-daytime-4XK2oKKvzVU?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
* Photo by <a href="https://unsplash.com/@jonathanroger?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Jonathan Roger</a> on <a href="https://unsplash.com/photos/building-beside-body-of-water-during-night-time-LY1eyQMFeyo?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
* Photo by <a href="https://unsplash.com/@1nimidiffa_?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Nimi Diffa</a> on <a href="https://unsplash.com/photos/man-in-red-sweater-wearing-black-framed-eyeglasses-OWabN5X6xOQ?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
* Photo by <a href="https://unsplash.com/@daheedarlingson?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Dahee Son</a> on <a href="https://unsplash.com/photos/people-near-seashore-during-daytime-tMffGE7u1bI?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
* Photo by <a href="https://unsplash.com/@timbog80?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Tim Bogdanov</a> on <a href="https://unsplash.com/photos/man-standing-on-top-of-mountain-4uojMEdcwI8?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
* Photo by <a href="https://unsplash.com/@bmatangelo?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Brian Matangelo</a> on <a href="https://unsplash.com/photos/boy-in-swimming-goggles-in-swimming-pool-during-daytime-ZU23GWLoCWc?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
* Photo by <a href="https://unsplash.com/@henrihere?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Henri Pham</a> on <a href="https://unsplash.com/photos/woman-in-jacket-looking-at-building-u6JG0eYjcEU?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
* Photo by <a href="https://unsplash.com/@tli427?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Tony Lee</a> on <a href="https://unsplash.com/photos/square-brown-wooden-table-8IKf54pc3qk?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
* Photo by <a href="https://unsplash.com/@steph?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Stephanie Liverani</a> on <a href="https://unsplash.com/photos/woman-wearing-black-scoop-neck-long-sleeved-shirt-Zz5LQe-VSMY?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
* Photo by <a href="https://unsplash.com/@brendangreenway?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Brendan Greenway</a> on <a href="https://unsplash.com/photos/aerial-photography-of-city-scapes-at-daytime-SouFaFk9-KQ?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
* Photo by <a href="https://unsplash.com/@billstephan?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Bill Stephan</a> on <a href="https://unsplash.com/photos/golden-retriever-puppy-on-focus-photo-9LkqymZFLrE?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
* Photo by <a href="https://unsplash.com/@shotsbytania?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Tânia Mousinho</a> on <a href="https://unsplash.com/photos/white-and-blue-concrete-building-near-body-of-water-during-daytime-vF0l0bqLRKY?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
* Photo by <a href="https://unsplash.com/@englishmum?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Becky Fantham</a> on <a href="https://unsplash.com/photos/fruit-cake-on-blue-cake-holder-DIUJSBiJNoc?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
* Photo by <a href="https://unsplash.com/@milltownphotography?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Sam Barber</a> on <a href="https://unsplash.com/photos/brown-rocks-on-lake-during-daytime-jpvytpATuDE?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
* Photo by <a href="https://unsplash.com/@krisatomic?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Kris Atomic</a> on <a href="https://unsplash.com/photos/round-brown-wooden-table-with-french-press-on-top-with-white-ceramic-teacup-beside-3b2tADGAWnU?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
* Photo by <a href="https://unsplash.com/@campingwithstyle?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Shell CampingwithStyle</a> on <a href="https://unsplash.com/photos/brown-wooden-pathway-surrounded-by-green-trees-during-daytime-vC2aqFSIRh4?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
* Photo by <a href="https://unsplash.com/@bloberoonie?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Steve Taylor</a> on <a href="https://unsplash.com/photos/body-of-water-near-trees-jYdCDkBda44?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
* Photo by <a href="https://unsplash.com/@zombience?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Ryan Spencer</a> on <a href="https://unsplash.com/photos/santorini-greece-XGKaRnWjv1c?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
* Photo by <a href="https://unsplash.com/@henry_be?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Henry Be</a> on <a href="https://unsplash.com/photos/big-ben-london-MdJq0zFUwrw?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>

<p align="right">(<a href="#readme-top">Back to Top</a>)</p>



<!-- Markdown Links & Images -->
[npm-nodejs-install-tutorial-url]: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
[mongodb-register-url]: https://account.mongodb.com/account/register
[mongodb-cluster-tutorial-url]: https://www.mongodb.com/resources/products/fundamentals/mongodb-cluster-setup
[cloudinary-register-url]: https://cloudinary.com/users/register_free
[github-oauth-tutorial-url]: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app
[project-link]: https://github.com/njcushing/odin-book
[license-shield]: https://img.shields.io/github/license/njcushing/odin-book.svg?style=for-the-badge
[license-url]: https://github.com/njcushing/odin-book/blob/main/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white
[linkedin-url]: https://linkedin.com/in/niall-cushing
[TypeScript]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=FFF
[TypeScript-url]: https://www.typescriptlang.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Node.js]: https://img.shields.io/badge/NodeJS-417e38?style=for-the-badge&logo=node.js&logoColor=FFF
[NodeJS-url]: https://nodejs.org/en
[MongoDB]: https://img.shields.io/badge/-MongoDB-4DB33D?style=for-the-badge&logo=mongodb&logoColor=FFFFFF
[MongoDB-url]: https://mongodb.com/
  