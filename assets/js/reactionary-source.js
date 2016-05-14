

var App = React.createClass({
  getInitialState: function() {
    return (
      {
        titles: ['Reactionary', 'Blogs', 'Projects'],
        primary : [{title: '', excerpt: '', content:'', id: 0 }],
        secondary : [{title: '', excerpt: '', content:'', id: 0 }],
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

/*
    $.get('wp-content/themes/reactionary/assets/content/posts.json', function (result) {
      if (this.isMounted()) {
        this.setState({
          menu: result.menu.posts,
          primary: result.primary.posts,
          secondary: result.secondary.posts,
          titles: [result.menu.title, result.primary.title, result.secondary.title],
        });
      }
    }.bind(this));
  },
*/


  render: function() {
    var active = this.state.active;
    var contentScope = this.state.contentScope;
    var blogname = this.state.titles[0];
    var primaryLocation = this.state.titles[1];
    var secondaryLocation = this.state.titles[2];


    return (
      <div id="content">
        <MastHead blogname={blogname} />
        <SidebarElement location="primary" labelTitle={primaryLocation} parent={this} />
        <SidebarElement location="secondary" labelTitle={secondaryLocation} parent={this} />       
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
    var featured_media = this.props.article.featured_media;
    return(
      <main id="main">
        <div className="featuredImage">
          {(this.props.article.featured_media ? <img src={this.props.article.image_urls.largeWide} imageSize="smallWide" /> : '')}
        </div>
        <div className="textContent">
          <h1 dangerouslySetInnerHTML={this.rawHTML(this.props.article.title)} />
          <div dangerouslySetInnerHTML={this.rawHTML(this.props.article.content)} />
        </div>
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
  
  rawHTML: function(text) {
    return {__html: text.rendered };
  },

  updateMainView: function (i, scopetype) {
    this.setState({active: i});
    this.setState({contentScope: scopetype});
  },

  render: function() {
    var loc = this.props.location;
    return(
          <ul id={loc}>
          <h3>{this.props.labelTitle}</h3>
          {this.props.parent.state[loc].map(function(singleCase, i) {
            return (
              <li onClick={this.props.parent.updateMainView.bind(null, i, loc)} key={i}>
                <a href="#">
                  {(singleCase.featured_media ? <img src={singleCase.image_urls.smallWide} imageSize="smallWide" /> : '')}
                  <span className="slinky">
                    <h4 dangerouslySetInnerHTML={this.rawHTML(singleCase.title)} />
                    <h6 dangerouslySetInnerHTML={this.rawHTML(singleCase.excerpt)} />
                  </span>
                </a>
              </li>
            );
          }, this)}
        </ul>
    );
  }
});

React.render(
  <App />,
  document.getElementById('body')
);