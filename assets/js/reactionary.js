'use strict';

var App = React.createClass({
  displayName: 'App',

  getInitialState: function getInitialState() {
    return {
      titles: ['Blogs', 'Projects'],
      blogs: [{ title: '', excerpt: '', content: '', id: 1 }],
      cases: [{
        title: 'Case nummer en',
        excerpt: 'Forskjellig ingress her også!',
        content: 'Alt er helt ulikt. Innhold case to.',
        id: 1
      }, {
        title: 'Case TO',
        excerpt: 'Ingress andre case!',
        content: 'Innhold tredje case.',
        id: 2
      }],
      active: [0],
      contentScope: 'blogs'
    };
  },

  rawHTML: function rawHTML(text) {
    return { __html: text.rendered };
  },

  updateMainView: function updateMainView(i, scopetype) {
    this.setState({ active: i });
    this.setState({ contentScope: scopetype });
  },

  componentDidMount: function componentDidMount() {
    $.get(this.props.blogSource, (function (result) {
      if (this.isMounted()) {
        this.setState({
          blogs: result
        });
      }
    }).bind(this));

    $.get(this.props.caseSource, (function (result) {
      if (this.isMounted()) {
        this.setState({
          cases: result
        });
      }
    }).bind(this));

    $.get('wp-content/themes/reactionary/assets/content/titles.json', (function (result) {
      if (this.isMounted()) {
        this.setState({
          titles: result
        });
      }
    }).bind(this));
  },

  render: function render() {
    var active = this.state.active;
    var contentScope = this.state.contentScope;
    var primaryLocation = this.state.titles[0];
    var secondaryLocation = this.state.titles[1];

    return React.createElement(
      'div',
      { id: 'content' },
      React.createElement(MastHead, null),
      React.createElement(SidebarElement, { location: 'cases', labelTitle: primaryLocation, parent: this }),
      React.createElement(SidebarElement, { location: 'blogs', labelTitle: secondaryLocation, parent: this }),
      React.createElement(MainView, { article: this.state[contentScope][active] })
    );
  }
});

var MainView = React.createClass({
  displayName: 'MainView',

  rawHTML: function rawHTML(text) {
    return { __html: text.rendered };
  },

  render: function render() {
    var featured_media = this.props.article.featured_media;
    return React.createElement(
      'main',
      { id: 'main' },
      React.createElement(
        'div',
        { className: 'featuredImage' },
        featured_media ? React.createElement(FeaturedImage, { imageID: this.props.article.featured_media, imageSize: 'largeFull' }) : ''
      ),
      React.createElement(
        'div',
        { className: 'textContent' },
        React.createElement('h1', { dangerouslySetInnerHTML: this.rawHTML(this.props.article.title) }),
        React.createElement('div', { dangerouslySetInnerHTML: this.rawHTML(this.props.article.content) })
      )
    );
  }
});

var MastHead = React.createClass({
  displayName: 'MastHead',

  rawHTML: function rawHTML(text) {
    return { __html: text.rendered };
  },
  render: function render() {
    return React.createElement(
      'div',
      { id: 'masthead' },
      React.createElement(
        'h1',
        null,
        'olemak'
      )
    );
  }
});

var SidebarElement = React.createClass({
  displayName: 'SidebarElement',

  rawHTML: function rawHTML(text) {
    return { __html: text.rendered };
  },

  updateMainView: function updateMainView(i, scopetype) {
    this.setState({ active: i });
    this.setState({ contentScope: scopetype });
  },

  render: function render() {
    var loc = this.props.location;
    return React.createElement(
      'ul',
      { id: loc },
      React.createElement(
        'h3',
        null,
        this.props.labelTitle
      ),
      this.props.parent.state[loc].map(function (singleCase, i) {
        return React.createElement(
          'li',
          { onClick: this.props.parent.updateMainView.bind(null, i, loc), key: i },
          React.createElement(
            'a',
            { href: '#' },
            singleCase.featured_media ? React.createElement(FeaturedImage, { imageID: singleCase.featured_media, imageSize: 'smallWide' }) : '',
            React.createElement(
              'span',
              { className: 'slinky' },
              React.createElement('h4', { dangerouslySetInnerHTML: this.rawHTML(singleCase.title) }),
              React.createElement('h6', { dangerouslySetInnerHTML: this.rawHTML(singleCase.excerpt) })
            )
          )
        );
      }, this)
    );
  }
});

var FeaturedImage = React.createClass({
  displayName: 'FeaturedImage',

  getInitialState: function getInitialState() {
    return {
      smallWide: 'wp-content/themes/reactionary/assets/images/ajax-loader.gif',
      largeFull: 'wp-content/themes/reactionary/assets/images/ajax-loader.gif'
    };
  },

  imageDataEndpoint: function imageDataEndpoint() {
    var endpoint = 'wp-json/wp/v2/media/' + this.props.imageID;
    return endpoint;
  },

  componentDidMount: function componentDidMount() {
    $.get(this.imageDataEndpoint(), (function (result) {
      if (this.isMounted()) {
        console.log(result);
        this.setState({
          'smallWide': result.media_details.sizes.smallWide.source_url,
          'largeFull': result.media_details.sizes.mediumFull.source_url
        });
      }
    }).bind(this));
  },

  render: function render() {
    return React.createElement('img', { src: this.state[this.props.imageSize] });
  }
});

var reactionary = React.createElement(App, {
  blogSource: 'wp-content/themes/reactionary/assets/content/primary.json',
  caseSource: 'wp-content/themes/reactionary/assets/content/secondary.json' });

React.render(reactionary, document.getElementById('body'));

//         console.log(singleCase.featured_media);
