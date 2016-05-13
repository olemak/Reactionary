

var App = React.createClass({
  getInitialState: function() {
    return (
      {
        titles: ['Blogs','Projects'],
        blogs : [{title: '', excerpt: '', content:'', id: 1 }],
        cases : [
          {
            title: 'Case nummer en',
            excerpt: 'Forskjellig ingress her også!',
            content:'Alt er helt ulikt. Innhold case to.',
            id: 1
          },
          {
            title: 'Case TO',
            excerpt: 'Ingress andre case!',
            content:'Innhold tredje case.',
            id: 2
          }
        ],
        active: [0],
        contentScope: 'blogs'
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
    $.get(this.props.blogSource, function (result) {
      if (this.isMounted()) {
        this.setState({
          blogs: result
        });
      }
    }.bind(this));

    $.get(this.props.caseSource, function (result) {
      if (this.isMounted()) {
        this.setState({
          cases: result
        });
      }
    }.bind(this));

    $.get('wp-content/themes/reactionary/assets/content/titles.json', function (result) {
      if (this.isMounted()) {
        this.setState({
          titles: result
        });
      }
    }.bind(this));
  },


  render: function() {
    var active = this.state.active;
    var contentScope = this.state.contentScope;
    var primaryLocation = this.state.titles[0];
    var secondaryLocation = this.state.titles[1];

    return (
      <div id="content">
        <MastHead />
        <SidebarElement location={"cases"} labelTitle={primaryLocation} parent={this} />
        <SidebarElement location={"blogs"} labelTitle={secondaryLocation} parent={this} />       
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
          {(featured_media ? <FeaturedImage imageID={this.props.article.featured_media} imageSize="largeFull" /> : '')}
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
        <h1>olemak</h1>
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
   //         console.log(singleCase.featured_media);
            return (
              <li onClick={this.props.parent.updateMainView.bind(null, i, loc)} key={i}>
                <a href="#">
                  {(singleCase.featured_media ? <FeaturedImage imageID={singleCase.featured_media} imageSize="smallWide" /> : '')}
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

var FeaturedImage = React.createClass({
  getInitialState: function() {
    return ({
      smallWide : 'wp-content/themes/reactionary/assets/images/ajax-loader.gif',
      largeFull : 'wp-content/themes/reactionary/assets/images/ajax-loader.gif'   
    });
  },

  imageDataEndpoint: function() {
    var endpoint = 'wp-json/wp/v2/media/' + this.props.imageID;
    return(endpoint);
  },

  componentDidMount: function() {
    $.get(this.imageDataEndpoint(), function (result) {
      if (this.isMounted()) {
        console.log(result);
        this.setState({
          'smallWide':  result.media_details.sizes.smallWide.source_url,
          'largeFull':  result.media_details.sizes.mediumFull.source_url
        });
      }
    }.bind(this));
  },

  render: function() {
    return(
        <img src={this.state[this.props.imageSize]} />
    );
  }
});

var reactionary = <App
    blogSource='wp-content/themes/reactionary/assets/content/primary.json'
    caseSource='wp-content/themes/reactionary/assets/content/secondary.json' />;

React.render(
  reactionary,
  document.getElementById('body')
);



