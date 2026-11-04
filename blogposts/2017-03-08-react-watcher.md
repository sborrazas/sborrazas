:title: "React Watcher – Watching prop changes in your ReactJS applications"
:date: 2017-03-08
:slug: react-watcher
:description: ReactJS helper for subscribing to prop changes
:keywords: "react,props,helper,util,subscribe"


While building web applications with ReactJS, I've found myself attaching
behavior to prop changes through the `componentWillReceiveProps` lifecycle hook.
In most cases, this behavior is particularly attached to a specific prop
changes.

This generates the following code structure, which is repeated throughout the
codebase:

<pre class="sh_javascript">
class UserDetail extends React.PureComponent {
  componentWillMount() {
    doSomething(this.props.params.id);
  }
  componentWillReceiveProps(nextProps) {
    if (props.params.id !== nextProps.params.id) {
      doSomething(nextProps.params.id);
    }
  }
  render() {
    return (/* ... */);
  }
}
</pre>

These lines of code were repeated throughout multiple components, and so I
decided to extract it into it's own little utility:
[React Watcher](https://github.com/sborrazas/react-watcher).

## React Watcher

**React Watcher** simply introduces a wrapper function, which exposes two
props on the wrapped component: `watch` and `unwatch`.

The `watch` function, allows binding a callback to a prop change, like so:
<pre class="sh_javascript">
const { watch } = this.props;

watch('params.id', (newId) => {
  doSomething(newId);
});
</pre>

The first parameter of the `watch` function is the path of the prop, which is
then used together with
[Lodash get function](https://lodash.com/docs/4.17.4#get) to access the prop.

The `unwatch` function, simply removes the binding:
<pre class="sh_javascript">
const { unwatch } = this.props;

unwatch('params.id');
</pre>

That's all there is to it, one thing.

## Caveats

**React Watcher** should be used sparingly, in cases where you can't really solve
the problem any other way. In most cases, where you need to do something when
some prop changes, you don't really need it. Why? Because in most cases you can
usually trigger the event together with the action with caused the prop to be
changed, e.g. when triggering a filtering change on a listing. Example:

<pre class="sh_javascript">
/* Bad */
class UsersList extends React.Component {
  render() {
    const { activeFilter, users } = this.props;

    return (/* ... */);
  }
  toggleActive(event) {
    dispatch(toggleActiveAction());
  }
  componentWillMount() {
    this.props.watch('activeFilter', (activeFilter) => {
      alert('Active filter has changed!');
    });
  }
}

export default connect(UsersList);
</pre>

A better practice would be something along the lines of:

<pre class="sh_javascript">
/* Good */
class UsersList extends React.Component {
  render() {
    const { activeFilter, users } = this.props;

    return (/* ... */);
  }
  toggleActive(event) {
    dispatch(toggleActiveAction());
    alert('Active filter has changed!');
  }
}
</pre>

When should **React Watcher** be used then? When you have no control over the
prop changes because of some external library. The most common use-case is
`react-router` and its params/query updates. Example:

<pre class="sh_javascript">
class UserDetail extends React.PureComponent {
  render() {
    const { users } = this.props;

    return (&lt;ul&gt;{/* users.map... */}&lt;/ul&gt;);
  }
  componentWillMount() {
    const { params, watch } = this.props;

    this.dispatch(fetchUser(params.id));
    watch('params.id', (newUserId) => {
      this.dispatch(fetchUser(newUserId));
    });
  }
}

export default connect(UserDetail);
</pre>


So make sure you use **React Watcher** appropriately!
