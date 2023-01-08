# Majoritifier

> Your playlist, handpicked by the others

Did your favorite artist have a lot of songs, or did your favorite movie soundtrack have hundreds of tracks, and you don't want to spend days trying to find the other track you might also like?

[**Majoritifier**](https://majoritifier.web.app) can help you with that - ever noticed the number of plays next to the track name or on the artist page? That reflects the track's popularity in the same artist, and we can rank them and create a personalized playlist just for you!

![Majoritifier Demo](https://user-images.githubusercontent.com/28344318/211208161-1ccbfece-3f67-4a3e-a796-9123d860cacd.gif)

### Try now! - [majoritifier.web.app](https://majoritifier.web.app)

## How does this work?

Each tracks has a popularity associated with them - so **Majoritifier** will gather all tracks popularity based on the selected artist's albums, retrieve the popularity and all that's left is just sorting them.

### Known limitations

The popularity returned by Spotify indicates popularity only when compared to tracks by the same artist. As a result, it is not possible to rank the tracks of multiple artists.

## Development Setup

Prerequisites:
- Node.js

**Majoritifier** is just a simple React app and can be easily setup with the following steps

1. Install dependencies
   ```sh
   npm install
   ```
2. Start the development server
   ```sh
   npm start
   ```
3. Development server can be accessible at [`localhost:3000`](http://localhost:3000)
