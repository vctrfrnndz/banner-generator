/** @jsx React.DOM */

var React = require('react');

var BannersCollection = [
  {
    "id": 0,
    "name": "Auth0 Square",
    "width": 300,
    "height": 250,
    "cssClass": "a0-banner-default square"
  },
  {
    "id": 1,
    "name": "Auth0 Horizontal",
    "width": 728,
    "height": 90,
    "cssClass": "a0-banner-default horizontal"
  },
  {
    "id": 2,
    "name": "StackOverflow Vertical",
    "width": 220,
    "height": 250,
    "cssClass": "a0-banner-default square stackoverflow"
  },
  {
    "id": 3,
    "name": "AuthTips Twitter Card",
    "width": 458,
    "height": 230,
    "cssClass": "a0-tips"
  },
  {
    "id": 4,
    "name": "AuthTips Twitter Card (Static)",
    "width": 458,
    "height": 230,
    "cssClass": "a0-tips static"
  }
];

var ContentEditable = React.createClass({
  render: function(){
    return <div
      className={this.props.className}
      ref={this.props.ref}
      onInput={this.emitChange}
      onBlur={this.emitChange}
      contentEditable
      spellCheck="false"
      dangerouslySetInnerHTML={{__html: this.props.html}}></div>;
  },
  shouldComponentUpdate: function(nextProps){
    return nextProps.html !== this.getDOMNode().innerHTML;
  },
  componentDidUpdate: function() {
    if (this.props.html !== this.getDOMNode().innerHTML) {
      this.getDOMNode().innerHTML = this.props.html;
    }
  },
  emitChange: function(){
    var html = this.getDOMNode().innerHTML;

    if (this.props.onChange && html !== this.lastHtml) {
      this.props.onChange({
        target: {
          value: html,
          name: this.props.ref
        }
      });
    }

    this.lastHtml = html;
  }
});

var Banner = React.createClass({
  getInitialState: function() {
    var config = this.props.config;

    return {
      copy: config.defaultCopy || 'Enter tagline here,<br/>To create your first banner',
      cta: config.defaultCTA || 'call-to-action'
    };
  },
  getStyles: function(x) {
    var props = this.props;

    return {
      width: props.config.width * x,
      height: props.config.height * x
    }
  },
  handleChange: function(event) {
    var state = {};

    state[event.target.name] = event.target.value;

    this.setState(state);
    this.props.updateDownload();
  },
  render: function () {
    return (
      <div className="stage">
        <div style={this.getStyles(1)} className={this.props.config.cssClass + ' a0-banner-base'}>
          <div className="center">
            <ContentEditable name="copy" ref="copy" className="copy" html={this.state.copy} onChange={this.handleChange} />
            <ContentEditable name="cta" ref="cta" className="btn btn-success btn-md" html={this.state.cta} onChange={this.handleChange} />
            <br/>
            <div className="logo"></div>
          </div>
        </div>
        <div className="clone-wrapper">
          <div ref="clone" style={this.getStyles(2)} className={this.props.config.cssClass + ' a0-banner-base clone'}>
            <div
              spellCheck="false"
              className="copy"
              dangerouslySetInnerHTML={{__html: this.state.copy}} />

            <div
              spellCheck="false"
              className="btn btn-success btn-md"
              dangerouslySetInnerHTML={{__html: this.state.cta}} />

            <br/>
            <div className="logo"></div>
          </div>
        </div>
      </div>
    );
  }
});

var Index = React.createClass({
  getInitialState: function() {
    return {
      banner: '',
      bannerTemplate: BannersCollection[0]
    }
  },
  componentDidMount: function() {
    this.generateURI();
  },
  generateURI: function() {
    var c = this;
    var button = c.refs.downloadButton.getDOMNode();
    var bannerComponent = c.refs.editedBanner;

    html2canvas(bannerComponent.refs.clone.getDOMNode(), {
      onrendered: function(canvas) {
        var img = canvas.toDataURL("image/png");

        c.setState({
          banner: img
        });
      }
    });
  },
  handleTemplateChange: function(event) {
    var val = event.target.value;

    this.setState({
      bannerTemplate: BannersCollection[val]
    });

    this.generateURI();
  },
  render: function () {
    var c = this;
    var template = c.state.bannerTemplate;

    var size = {
      w: template.width,
      h: template.height
    };

    var templateItem = function(item) {
      return <option key={item.id} value={item.id}>{item.name} ({item.width}x{item.height})</option>;
    };

    return (
      <div className="index">
        <p>
          <h2>Choose a Banner</h2>
          <select onChange={this.handleTemplateChange} value={c.state.bannerTemplate.id}>
            {BannersCollection.map(templateItem)}
          </select>
        </p>
        <Banner ref="editedBanner" config={template} updateDownload={this.generateURI} />
        <a href={this.state.banner} ref="downloadButton" download={'banner-' + size.w + 'x' + size.h + '.png'} className="btn btn-primary btn-lg">Get my banner <span className="icon icon-budicon-433"></span></a>
      </div>
    );
  }
});
React.renderComponent(
    <Index /> , document.querySelector('.appl'));
