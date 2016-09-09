const React = require('react');
const SimpleMDE = require('simplemde');
const generateId = require('./services/idGenerator');
const NOOP = require('./utils/noop');

module.exports = React.createClass({

  getInitialState: function() {
    return {
      keyChange: false
    }
  },

  getDefaultProps: function() {
    return {
      onChange: NOOP,
      options: {}
    }
  },

  componentWillMount: function() {
    this.id = generateId();
  },

  componentDidMount: function() {
    this.createEditor();
    this.addEvents();
    this.addExtraKeys();
  },

  componentWillReceiveProps: function(nextProps) {
    if (!this.state.keyChange) {
      this.simplemde.value(nextProps.value)
    }

    this.setState({
      keyChange: false
    });
  },

  componentWillUnmount: function() {
    this.removeEvents();
  },

  createEditor: function() {
    console.log(document.getElementById(this.id));
    const initialOptions = {
      element: document.getElementById(this.id)
    };

    const allOptions = Object.assign({}, initialOptions, this.props.options);
    this.simplemde = new SimpleMDE(allOptions);
  },

  eventWrapper: function() {
    this.setState({
      keyChange: true
    });
    this.simplemde.value();
    this.props.onChange(this.simplemde.value());
  },

  eventToolbar: function() {
    this.props.onChange(this.simplemde.value());
  },

  removeEvents: function() {
    this.editorEl.removeEventListener('keyup', this.eventWrapper);
    this.editorToolbarEl.removeEventListener('click', this.eventToolbar);
  },

  addEvents: function() {
    const wrapperId = `${this.id}-wrapper`;
    const wrapperEl = document.getElementById(`${wrapperId}`);

    this.editorEl = wrapperEl.getElementsByClassName('CodeMirror')[0];
    this.editorToolbarEl = wrapperEl.getElementsByClassName('editor-toolbar')[0];

    this.editorEl.addEventListener('keyup', this.eventWrapper);
    this.editorToolbarEl.addEventListener('click', this.eventToolbar);
  },

  addExtraKeys: function() {
    // https://codemirror.net/doc/manual.html#option_extraKeys
    if (this.props.extraKeys) {
      this.simplemde.codemirror.setOption(
        'extraKeys',
        this.props.extraKeys
      );
    }
  },

  render: function() {
    const textarea = React.createElement('textarea', {id: this.id});
    return React.createElement('div', {id: `${this.id}-wrapper`}, textarea)
  }
});
