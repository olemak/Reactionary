'use strict';

var App = React.createClass({
  displayName: 'App',

  getInitialState: function getInitialState() {
    return {
      titles: ['Reactionary', 'Blogs', 'Projects'],
      primary: [{ title: '', excerpt: '', content: '', id: 0 }],
      secondary: [{ title: '', excerpt: '', content: '', id: 0 }],
      active: [0],
      contentScope: 'primary'
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
    var connection = new XMLHttpRequest();
    connection.open('GET', 'wp-content/themes/reactionary/assets/content/posts.json', true);
    connection.send();
    connection.onreadystatechange = (function () {
      if (connection.readyState == 4 && connection.status == 200) {
        var result = JSON.parse(connection.responseText);
        if (this.isMounted()) {
          this.setState({
            menu: result.menu.posts,
            primary: result.primary.posts,
            secondary: result.secondary.posts,
            titles: [result.menu.title, result.primary.title, result.secondary.title]
          });
        }
      }
    }).bind(this);
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

  render: function render() {
    var active = this.state.active;
    var contentScope = this.state.contentScope;
    var blogname = this.state.titles[0];
    var primaryLocation = this.state.titles[1];
    var secondaryLocation = this.state.titles[2];

    return React.createElement(
      'div',
      { id: 'content' },
      React.createElement(MastHead, { blogname: blogname }),
      React.createElement(SidebarElement, { location: 'primary', labelTitle: primaryLocation, parent: this }),
      React.createElement(SidebarElement, { location: 'secondary', labelTitle: secondaryLocation, parent: this }),
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
        this.props.article.featured_media ? React.createElement('img', { src: this.props.article.image_urls.largeWide, imageSize: 'smallWide' }) : ''
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
        this.props.blogname
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
            singleCase.featured_media ? React.createElement('img', { src: singleCase.image_urls.smallWide, imageSize: 'smallWide' }) : '',
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

React.render(React.createElement(App, null), document.getElementById('body'));
