'use strict';

var server = require('../server');

var migrationPromise = new Promise(function(resolve, reject) {
  server.dataSources.mongodbDs.automigrate('Media', function(err) {
    if (err) return reject(err);
    server.dataSources.mongodbDs.automigrate('CustomUser', function(err) {
      if (err) return reject(err);
      server.dataSources.mongodbDs.automigrate('Post', function(err) {
        if (err) return reject(err);
        resolve();
      });  
    });
  });
});

migrationPromise.then(function() {
  var media1 = new server.models.Media({
    'cover': 'Favorites',
    'thumbnail': 'My Favorite Songs'
  });
  var media2 = new server.models.Media({
    'cover': 'Good',
    'thumbnail': 'Good Songs'
  });
  var user1 = new server.models.CustomUser({
    'username': 'Paul',
    'email': 'paul@paul.com',
    'password': 'paul',
    'thumbnail': 'My Favorite Songs'
  });
  var user2 = new server.models.CustomUser({
    'username': 'william',
    'email': 'william@william.com',
    'password': 'william',
    'thumbnail': 'Good Songs'
  });
  var post1 = new server.models.Post({
    'title': 'Favorites',
    'description': 'My Favorite Songs',
    'createdAt': 34343434343,
    'upvotes': 2,
    'downvotes': 2
  });
  var post2 = new server.models.Post({
    'title': 'Good',
    'description': 'Good Songs',
    'createdAt': 343434333232,
    'upvotes': 4,
    'downvotes': 1
  });

  var promise1 = new Promise(function(resolve, reject) {
    media1.save(function(err, media1Obj) {
      if (!err) {
        return media2.save(function(err, media2Obj) {
          if (!err) {
            return resolve({ media1: media1Obj, media2: media2Obj });
          }
          reject(err);
        });
      }
      reject(err);
    });
  });
  
  var promise2 = new Promise(function(resolve, reject) {
    user1.save(function(err, user1Obj) {
      if (!err) {
        return user2.save(function(err, user2Obj) {
          if (!err) {
            return resolve({ user1: user1Obj, user2: user2Obj });
          }
          reject(err);
        });
      }
      reject(err);
    });
  });
  
  var promises = [ promise1, promise2 ];
  Promise.all(promises)
    .then(function(result) {
      var media1Result = result[0].media1;
      var media2Result = result[0].media2;
      var user1Result = result[1].user1;
      var user2Result = result[1].user2;
      post1.mediaId = media1Result.id;
      post1.customUserId = user1Result.id;
      post2.mediaId = media2Result.id;
      post2.customUserId = user2Result.id;
      post1.save(function(err) {
        if (!err) {
          post2.save(function(err) {
            if (!err) {
              console.log('-----Seeded successfully!!!-----');
              process.exit(0);
            }
          })
        }
      });
    });
});
