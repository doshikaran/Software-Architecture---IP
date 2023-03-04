// Required modules
const express = require('express');
const Jimp = require('jimp');
const multer = require('multer');
const fs = require('fs');

// Set up Express app
const app = express();
const port = process.env.PORT || 3000;

// Set up Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Set up static file serving for processed images
app.use('/processed', express.static('processed'));

// Process image endpoint
app.post('/operate', upload.single('image'), async (req, res) => {
  try {
    // Load input image
    const image = await Jimp.read(req.file.path);

    // Apply operations in specified order
    const operations = JSON.parse(req.body.operations);
    for (let i = 0; i < operations.length; i++) {
      const operation = operations[i];
      switch (operation.type) {
        case 'flipHorizontal':
          image.flip(true, false);
          break;
        case 'flipVertical':
          image.flip(false, true);
          break;
        case 'rotate':
          image.rotate(operation.degrees, false);
          break;
        case 'grayscale':
          image.grayscale();
          break;
        case 'resize':
          image.resize(operation.width, operation.height);
          break;
        case 'thumbnail':
          image.resize(operation.width, operation.height, Jimp.RESIZE_BEZIER);
          break;
        case 'rotateLeft':
          image.rotate(-90, false);
          break;
        case 'rotateRight':
          image.rotate(90, false);
          break;
      }
    }

    // Save output image
    const outputImage = `processed/${req.file.filename}_processed.png`;
    await image.writeAsync(outputImage);

    // Return URL of processed image
    res.send({ url: `http://localhost:${port}/${outputImage}` });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to operate image' });
  } finally {
    // Clean up input file
    fs.unlink(req.file.path, (error) => {
      if (error) {
        console.error(error);
      }
    });
  }
});

if (req.isRPC) {
  req.rpcContext.sendResult(result);
} else {
  res.send(result);
}
} catch (error) {
console.error(error);

// If this is an RPC request, send the error as an RPC error instead of an HTTP error
if (req.isRPC) {
  req.rpcContext.sendError('Failed to operate image');
} else {
  res.status(500).send({ error: 'Failed to operate image' });
}
} finally {
// Clean up input file
fs.unlink(req.file.path, (error) => {
  if (error) {
    console.error(error);
  }
});
}
});
// Set up RPC server
const rpcServer = new rpc.Server();
rpcServer.expose('operate', (params, rpcContext, callback) => {
  // Mark the request as an RPC request
  rpcContext.req.isRPC = true;
  rpcContext.req.rpcContext = rpcContext;

  // Call the original endpoint function
  app.handle(req, res, (error) => {
    if (error) {
      callback(error);
    }
  });
});


// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
