var App = React.createClass({
  getInitialState: function() {
    return (
      {
        content: {
          menu: {posts: [{title: 'Menu item #1', excerpt: '', content:'', id: 0 },{title: 'Menu item #2', excerpt: '', content:'', id: 1 }], title: 'Menu', status: 'collapsed', initialItemNumber: 2, displayItems: 2},
          primary: {posts: [{title: '', excerpt: '', content:'', id: 0 }, {title: '', excerpt: '', content:'', id: 1 }], title: 'Primary', status: 'collapsed', initialItemNumber: 2, displayItems: 2},
          secondary: {posts: [{title: '', excerpt: '', content:'', id: 0 }, {title: '', excerpt: '', content:'', id: 1 }], title: 'Secondary', status: 'collapsed', initialItemNumber: 2, displayItems: 2},
        },
        active: 0,
        contentScope: 'primary',
        mainStatus: 'expanded'
      });
  },

  rawHTML: function(text) {
    return {__html: text.rendered };
  },

  updateMainView: function (i, scopetype) {
    this.setState({active: i});
    this.setState({contentScope: scopetype});
    var newState = this.state.content;
        newState.primary.status = 'collapsed';
        newState.primary.displayItems = newState.primary.initialItemNumber;
        newState.secondary.status = 'collapsed';
        newState.secondary.displayItems = newState.secondary.initialItemNumber;
    this.setState({content: newState});
    this.setState({mainStatus: 'expanded'});
  },


  componentDidMount: function() {
    var connection = new XMLHttpRequest();
    connection.open("GET", 'wp-content/themes/reactionary/assets/content/posts.json', true);
    connection.send();
    connection.onreadystatechange = function() {
      if (connection.readyState==4 && connection.status==200) {
      var result = JSON.parse(connection.responseText);
        if (this.isMounted()) {
          let newState = this.state.content;
            newState.menu.posts = result.menu.posts;
            newState.menu.title = result.menu.title;
            newState.menu.displayItems = result.menu.posts.length;
            newState.primary.posts = result.primary.posts;
            newState.primary.title = result.primary.title;
            newState.secondary.posts = result.secondary.posts;
            newState.secondary.title = result.secondary.title;
          this.setState({content: newState});
        }
      }
    }.bind(this);
  },

  render: function() {
    var active = this.state.active;
    var contentScope = this.state.contentScope;
    var blogname = this.state.content.menu.title;
    var primaryLocation = this.state.content.primary.title;
    var secondaryLocation = this.state.content.secondary.title;


    return (
      <div id="content">
        <MastHead blogname={blogname} />
        <SidebarElement location="primary" labelTitle={primaryLocation} initialItemNumber={4} parent={this} />
        <SidebarElement location="secondary" labelTitle={secondaryLocation} initialItemNumber={4} parent={this} />       
        <MainView article={this.state.content[contentScope].posts[active]} status={this.state.mainStatus} />
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
      <main id="main" className={this.props.status}>
          {(this.props.article.image_urls ? <img className="mainImage" src={imageurl} /> : '')}
          <h1  className="mainTitle" dangerouslySetInnerHTML={this.rawHTML(this.props.article.title)} />
          <div className="mainContent" dangerouslySetInnerHTML={this.rawHTML(this.props.article.content)} />
      </main>
    );
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
  //    displayItems: this.props.initialItemNumber,          // How many sidebar items should the first page loop through
 //     status: 'collapsed',      // Toggle class - it is either either "collapsed" or "expanded"
    });
  },

  componentWillMount: function() {
    let newState = this.props.parent.state;
        newState.content[this.props.location].initialItemNumber = this.props.initialItemNumber;
        newState.content[this.props.location].displayItems = this.props.initialItemNumber;
    this.props.parent.setState({content: newState.content});
  },

  rawHTML: function(text) {
    return {__html: text.rendered };
  },

  updateMainView: function(i, loc){
    window.scrollTo(0,0);
    this.props.parent.updateMainView(i, loc);
  },

  expandSideBar: function(event, loc){
    let newState = this.props.parent.state.content;
    let thisSidebar = (loc === 'primary' ? 'primary' : 'secondary');
    let otherSidebar = (loc === 'primary' ? 'secondary' : 'primary');

    newState[thisSidebar].status = (newState[thisSidebar].status === 'collapsed' ? 'expanded' : 'collapsed');
    newState[otherSidebar].status = 'collapsed';
    console.log(newState[loc]);
    newState[thisSidebar].displayItems = (newState[thisSidebar].status === 'expanded' ? newState[thisSidebar].posts.length : newState[thisSidebar].initialItemNumber);
    newState[otherSidebar].displayItems = (newState[otherSidebar].status === 'expanded' ? newState[otherSidebar].posts.length : newState[otherSidebar].initialItemNumber);
    newState.mainStatus = (newState.primary  === 'collapsed' && newState.secondary === 'collapsed' ? 'expanded' : 'collapsed');  
    this.props.parent.setState({content: newState});
  },


  render: function() {
    let loc = this.props.location;
    let cutoff = this.props.parent.state.content[loc].displayItems;
    let displayedItems = this.props.parent.state.content[loc].posts.slice(0, cutoff);
          return(
          <ul id={loc} className={this.props.parent.state.content[loc].status}>
          <h3 className="title">{this.props.labelTitle}</h3>
          {displayedItems.map(function(singleCase, i) {
            return (
              <li onClick={this.updateMainView.bind(null, i, loc)} className={(singleCase.image_urls ? "hasimage" : '')} key={i}>
                  {(singleCase.image_urls ? <img src={singleCase.image_urls.smallWide} imageSize="smallWide" /> : '')}
                  <h4 dangerouslySetInnerHTML={this.rawHTML(singleCase.title)} />
                  <div className="excerpt" dangerouslySetInnerHTML={this.rawHTML(singleCase.excerpt)} />
              </li>
            );
          }, this)}
          <h3 onClick={this.expandSideBar.bind(null, event, loc)} className="expandButton" />
        </ul>
    );
  }
});

React.render(
  <App />,
  document.getElementById('body')
);