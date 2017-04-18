(function() {
  function WebcamService() {

    /*
     * Converts a dataURI to a blob.
     * Source: http://stackoverflow.com/questions/12168909/blob-from-dataurl */
    function dataURItoBlob(dataURI) {
      // convert base64 to raw binary data held in a string
      // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
      var byteString = atob(dataURI.split(',')[1]);

      // separate out the mime component
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

      // write the bytes of the string to an ArrayBuffer
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }

      // write the ArrayBuffer to a blob, and you're done
      var blob = new Blob([ab], {type: mimeString});
      return blob;
    }

    return {

      rotateSnapshot: function(canvas) {
        var myImage = new Image();
        myImage.src = canvas.toDataURL();
        var context = canvas.getContext("2d");
        var ch = canvas.height, cw = canvas.width;
        myImage.onload = function () {
          // reset the canvas with new dimensions
          canvas.width = ch;
          canvas.height = cw;
          cw = canvas.width;
          ch = canvas.height;

          context.save();
          // translate and rotate
          context.translate(cw, ch / cw);
          context.rotate(Math.PI / 2);
          // draw the previows image, now rotated
          context.drawImage(myImage, 0, 0);               
          context.restore();
          myImage = null;
        }
      },

      /*
       * Take a snapshot from the video channel and write it to 
       * the canvas. */
      takeSnapshot: function(channel, canvas, width, height) {
        canvas.width = width;
        canvas.height = height;
        var context = canvas.getContext('2d');
        context.fillRect(0, 0, canvas.width, canvas.height);
        // Grab the image from the video
        context.drawImage(channel.video, 0, 0, canvas.width, canvas.height);
      },

      /*
       * Convert the canvas to a data URL, then convert
       * that to a Blob, and convert that to a file...
       * Queue that file for upload when done. */
      uploadPicture: function(uploader, canvas) {
        var dataURL = canvas.toDataURL();

        var blob = dataURItoBlob(dataURL);

        var image = new File([blob], 'upload.png');
        uploader.addToQueue(image);
      }

    };
  }

  angular.module('ttkdApp')
    .factory('WebcamService', [WebcamService]);
})();