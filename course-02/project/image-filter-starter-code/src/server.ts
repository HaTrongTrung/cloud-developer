import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", async (req, res) => {
    const imageUrl = <string>req.query.image_url;

    // 1. validate the image_url query
    if (!imageUrl) {
      return res.status(422).send('Image URL can not be null');
    }

    // 2. call filterImageFromURL(image_url) to filter the image
    const filteredImage = filterImageFromURL(imageUrl);

    // 3. send the resulting file in the response
    filteredImage.then(filteredImagePath => {
      res.sendFile(filteredImagePath, {}, err => {

        // 4. deletes any files on the server on finish of the response
        const filteredImagePaths = [];
        filteredImagePaths.push(filteredImagePath);
        deleteLocalFiles(filteredImagePaths)
      })
    });

  })
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();