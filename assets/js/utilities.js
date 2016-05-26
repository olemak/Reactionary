


/************ COPYBUTTON ************/
/*
function reactionaryCopybutton(container = document.getElementsByTagName('body')[0], tags = ['blockquote', 'pre', 'code']) {
  if(document.execCommand){

    // purge hiddenCopyContainers - there can be only one
    var existingHiddenContainer = document.getElementById('hiddenCopyContainer');
    if (existingHiddenContainer) existingHiddenContainer.remove();

    var hiddenCopyContainer = document.createElement('TEXTAREA');
    hiddenCopyContainer.style.position = 'absolute';
    hiddenCopyContainer.style.left = '-200vw';
    hiddenCopyContainer.id = 'hiddenCopyContainer';
    window.body.appendChild(hiddenCopyContainer);

    var blocks = container.querySelectorAll(tags.join());
    if (blocks.length > 0) {
      for(var i = 0; i < blocks.length; i++){
        var copyButton = document.createElement('BUTTON');
            copyButton.className = 'reactionary-copy-button';
            copyButton.innerHTML = '<h5>Copy</h5>';
            copyButton.addEventListener("click", reactionaryCopyClickListener.bind(null, blocks[i].innerText));
        blocks[i].appendChild(copyButton);
      }
    }
  }
}

function reactionaryCopyClickListener(textToCopy) {
    var hiddenCopyContainer = document.getElementById('hiddenCopyContainer');
        hiddenCopyContainer.value = textToCopy;
        hiddenCopyContainer.select();
        document.execCommand('copy');
}
*/

/************* Tweetbutton ***********/
/*
function reactionaryTweetbutton() {
  var quotes = document.getElementsByTagName('blockquote');
  if (quotes.length > 0) {
     for(var i = 0; i < quotes.length; i++){
      var link = window.location.href;
      var tweetButton = document.createElement('A');
          tweetButton.className = 'reactionary-tweet-link';
          tweetButton.innerHTML = '<h5>Tweet This</h5>';
          tweetButton.target = "_blank";
          tweetButton.href="http://twitter.com/home/?status=" + quotes[i].innerText.substring(0, (159 - link.length)) + ' ' + link;
          tweetButton.addEventListener("click", reactionaryCopyClickListener.bind(null, quotes[i].innerText));
      quotes[i].appendChild(tweetButton);
    }
  }
}

*/

/************ Media size quantifier ***************/
// Quantifies the size of display/screen from 1 (small) to 5 (really big)
/*
function reactionaryScreenSize() {
  var size = parseInt(screen.width / 640);
  console.log(size);  
}
*/