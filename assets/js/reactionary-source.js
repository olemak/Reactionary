var App = React.createClass({
  getInitialState: function() {
    return (
      {
        titles: ['Site Name', 'Primary', 'Secondary'],
        primary : [{title: '', excerpt: '', content:'', id: 0 }, {title: '', excerpt: '', content:'', id: 1 }],
        secondary : [{title: '', excerpt: '', content:'', id: 2 }, {title: '', excerpt: '', content:'', id: 3 }],
        active: [0],
        contentScope: 'primary'
      });
  },

  rawHTML: function(text) {
    return {__html: text.rendered };
  },

  updateMainView: function (i, scopetype) {
    this.setState({active: i});
    this.setState({contentScope: scopetype});
    document.getElementById('main').classList.remove('collapsed');
    document.getElementById('main').classList.add('expanded');
    document.getElementById('primary').classList.remove('expanded');
    document.getElementById('primary').classList.add('collapsed');
    document.getElementById('secondary').classList.remove('expanded');
    document.getElementById('secondary').classList.add('collapsed');
  },


  componentDidMount: function() {
    var connection = new XMLHttpRequest();
    connection.open("GET", 'wp-content/themes/reactionary/assets/content/posts.json', true);
    connection.send();
    connection.onreadystatechange = function() {
      if (connection.readyState==4 && connection.status==200) {
      var result = JSON.parse(connection.responseText);
        if (this.isMounted()) {
          this.setState({
            menu: result.menu.posts,
            primary: result.primary.posts,
            secondary: result.secondary.posts,
            titles: [result.menu.title, result.primary.title, result.secondary.title],
          });
        }
      }
    }.bind(this);
  },

  render: function() {
    var active = this.state.active;
    var contentScope = this.state.contentScope;
    var blogname = this.state.titles[0];
    var primaryLocation = this.state.titles[1];
    var secondaryLocation = this.state.titles[2];


    return (
      <div id="content">
        <MastHead blogname={blogname} />
        <SidebarElement location="primary" labelTitle={primaryLocation} initialItemNumber={3} parent={this} />
        <SidebarElement location="secondary" labelTitle={secondaryLocation} initialItemNumber={4} parent={this} />       
        <MainView article={this.state[contentScope][active]} />
      </div>
    );
  }
});

var MainView = React.createClass({

  rawHTML: function(text) {
    return {__html: text.rendered };
  },

  render: function() {
      if (this.props.article.image_urls) {
        var $screensize = parseInt(screen.width / 640);
        var imageurl = ($screensize < 2 ? this.props.article.image_urls.smallWide : ($screensize < 3 ? this.props.article.image_urls.mediumWide : this.props.article.image_urls.largeWide));
      }

    return(
      <main id="main" className="expanded">
          {(this.props.article.image_urls ? <img className="mainImage" src={imageurl} /> : '')}
          <h1  className="mainTitle" dangerouslySetInnerHTML={this.rawHTML(this.props.article.title)} />
          <div className="mainContent" dangerouslySetInnerHTML={this.rawHTML(this.props.article.content)} />
      </main>
    );
  },

  componentDidUpdate: function() {
    var main = document.getElementById('main');
    var tags = ['pre', 'code'];
    reactionaryCopybutton(main, tags);
  }

});

var MastHead = React.createClass({

  rawHTML: function(text) {
    return {__html: text.rendered };
  },
  render: function(){
    return(
      <div id="masthead">
        <h1>{this.props.blogname}</h1>
      </div>
    );
  }
});


var SidebarElement = React.createClass({
    getInitialState: function() {
    return ({
      displayItems: this.props.initialItemNumber,          // How many sidebar items should the first page loop through
      status: 'collapsed',      // Toggle class - it is either either "collapsed" or "expanded"
    });
  },

  rawHTML: function(text) {
    return {__html: text.rendered };
  },

  updateMainView: function(i, loc){
    window.scrollTo(0,0);
    this.props.parent.updateMainView(i, loc);
    this.setState({status: 'collapsed'});
    this.setState({displayItems: this.props.initialItemNumber});
  },

  expandSideBar: function(event){
    let main = document.getElementById('main');
    let oldMainDisplayClass = '';
    let newMainDisplayClass = '';

    if (this.state.status === 'collapsed') {
      // initial state / Collapsed -> Expanded
      this.setState({status: 'expanded'});
      this.setState({clickMessage: 'Show Less'});
      this.setState({displayItems: this.props.parent.state[this.props.location].length}) // show all the items
      oldMainDisplayClass = 'expanded';
      newMainDisplayClass = 'collapsed';

    } else {
      // When closing down / expanded -> collapsed
      this.setState({status: 'collapsed'});
      this.setState({clickMessage: 'Show More'});
      this.setState({displayItems: this.props.initialItemNumber}) // show all the items
      oldMainDisplayClass = 'collapsed';
      newMainDisplayClass = 'expanded';
    };

    main.classList.remove(oldMainDisplayClass);
    main.classList.add(newMainDisplayClass);
  },


  render: function() {
    var loc = this.props.location;
    let displayedItems = this.props.parent.state[loc].slice(0, this.state.displayItems);
          return(
          <ul id={loc} className={this.state.status}>
          <h3 className="title">{this.props.labelTitle}</h3>
          {displayedItems.map(function(singleCase, i) {
            return (
              <li onClick={this.updateMainView.bind(null, i, loc)} key={i}>

                  {(singleCase.image_urls ? <img src={singleCase.image_urls.smallWide} imageSize="smallWide" /> : '')}
                  <span className="slinky">
                    <h4 dangerouslySetInnerHTML={this.rawHTML(singleCase.title)} />
                    <div className="excerpt" dangerouslySetInnerHTML={this.rawHTML(singleCase.excerpt)} />
                  </span>

              </li>
            );
          }, this)}
            <li onClick={this.expandSideBar} >
              <h3 className="expandButton">
              </h3>
            </li>
        </ul>
    );
  }
});

React.render(
  <App />,
  document.getElementById('body')
);



/************ COPYBUTTON ************/
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


/************* Tweetbutton ***********/
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



/************ Media size quantifier ***************/
// Quantifies the size of display/screen from 1 (small) to 5 (really big)

function reactionaryScreenSize() {
  var size = parseInt(screen.width / 640);
  console.log(size);  
}