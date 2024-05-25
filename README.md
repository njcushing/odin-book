<a name="readme-top"></a>


<!-- Project Shields -->
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- Project Information Overview -->
<br />
<div align="center">
  <h3 align="center">Odin Book</h3>

  <p align="center">
    A social media application designed as part of The Odin Book's NodeJS course.
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
        <li><a href="#posts">Posts</a></li>
        <li><a href="#chats">Chats</a></li>
        <li><a href="#profile">Profile</a></li>
      </ul>
    </li>
    <li><a href="#future-features">Roadmap</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- About the Project -->
## About the Project

This project was designed as part of The Odin Project's NodeJS course. It is a social media site with numerous features, including:
* <a href="#posts">Posts</a>, which can contain both text and images,
* <a href="#chats">Chats</a> with other users,
* A personal <a href="#profile">profile</a>, on which you can set a custom name, bio, profile image and theme, and which has individual 'tabs' for your posts, replies, likes, followed users and users following you,
* An information sidebar which displays recommended users, recent posts from your followed users and recent chat activity.

<p align="right">(<a href="#readme-top">Back to Top</a>)</p>



### Built With

[![TypeScript][TypeScript]][TypeScript-url]  
[![React][React.js]][React-url]  
[![NodeJS][NodeJS.js]][NodeJS-url]  

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
5. Create a file for your environment variables: `.env`
6. Inside `.env`, you will need the following environment variables:
    * `PORT` - The port on which you want your server to be open, e.g. - `3000`
    * `MONGO_URI` - The connection string for your MongoDB cluster
    * `AUTH_CLIENT_SECRET` - A password for creating JSONWebTokens
    * `GITHUB_CLIENT_ID` - The ClientID in your application's OAuth settings
    * `GITHUB_CLIENT_SECRET` - The generated client secret in your application's OAuth settings
    * `GITHUB_CALLBACK_URI` - The callback URL to redirect the user to when authorizing their GitHub account (should be  the same as the 'Authorization callback URL' field in your application's OAuth settings)
    * `GUEST_PASSWORD` - A password for the guest account
    * `VITE_SERVER_DOMAIN` - Your server's domain, e.g. - `"http://localhost:3000"`
    * `CLIENT_DOMAIN` - Your client's domain, e.g. - `"http://localhost:5173"`
    * `TRUSTED_DOMAINS` - An array containing the domains your server should trust, e.g. - `["http://localhost:5173"]`
    * `CLOUDINARY_NAME` - Your Cloudinary account's cloud name
    * `CLOUDINARY_API_KEY` - Your Cloudinary account's API key
    * `CLOUDINARY_API_SECRET` - Your Cloudinary account's API secret
7. Run the npm scripts for compiling and starting the backend and frontend applications
   ```sh
   npm run start:back
   npm run start:front
   ```
8. Open the client's domain in your chosen browser

<p align="right">(<a href="#readme-top">Back to Top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

### Posts

### Chats

### Profile

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
- [ ] Display 'popular' users (with many followers) in 'Recommended Users' tab in the absence of other recommendations

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
[NodeJS.js]: https://img.shields.io/badge/NodeJS-417e38?style=for-the-badge&logo=node.js&logoColor=FFF
[NodeJS-url]: https://reactjs.org/