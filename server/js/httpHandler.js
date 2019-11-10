const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
const keypressHandler = require('./keypressHandler');
const messageQueue = require('./messageQueue');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

// let messageQueue = null;
// module.exports.initialize = (queue) => {
//   messageQueue = queue;
// };

module.exports.router = (req, res, next = ()=>{}) => {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);

  if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  }

  // GET Route
  if (req.method === 'GET') {

    // GET for directions
    if (req.url === '/') {
      res.writeHead(200, headers);
      let msg = messageQueue.dequeue();
      if(msg) {
        console.log(msg, 'dequeue');
        res.write(msg)
      }
      res.end();
    }

    if (req.url === '/background.jpg') {
      console.log('url', req.url);
      fs.readFile(module.exports.backgroundImageFile, function(err, data) {
        if (err) {
          console.error(err);
          res.writeHead(404, headers);
          res.end();
        } else {
          console.log(data);
          res.writeHead(200, headers);
          res.write(data, 'binary');
          res.end()
        }
      });
    }

    // File path for image
    if (fs.exists(req.url)) {
      console.log(req.url);
        res.writeHead(200, headers);
        res.end();
      } else {
        res.writeHead(404, headers);
        res.writeHead(200, headers);
        res.end();
      }


  }

  // POST Route
  if (req.method === 'POST') {
    res.writeHead(201, headers);

    fs.writeFile(module.exports.backgroundImageFile, req._postData);
    // req._postData

    // part.filename part.data
    // module.exports.backgroundImageFile
    // fs.writeFile ()
    res.end();
  }

  next(); // invoke next() at the end of a request to help with testing!
};
