:title: "Redux ApiMap – A Guide for building scalable API interaction"
:date: 2017-03-03
:slug: redux-apimap
:description: Building a simple app using react, redux and redux-apimap
:keywords: "redux,api,react,rest,connect"


The biggest problem I've had so far when building applications using the
[React](https://facebook.github.io/react/) and [Redux](http://redux.js.org/)
stack is that I never seem to be able to get the interaction with my JSON API
right.

My very first attempts involved creating wrapper JavaScript libraries that
wrapped my APIs in complicated ways. To be able to handle every case, I would
add tons of options and configuration parameters. This, of course, didn't scale.

It was only when I realized that since every RESTful API is different (trust me,
**very different**) that I knew I wasn't going to be able to build something
that could handle every case elegantly.

In order to finally come up with something that felt right, I went through every
single React/Redux projects I've been working on lately and came up with
an extremely simple library, which only provides the most cumbersome pieces of
interacting with an API: **dispatching Redux actions with all the information
you need**. This includes:

* Allowing URL interpolation through action parameters (e.g. `/users/:id`).
* Sending the configuration necessary to both send and fetch the JSON object
  through the `fetch` API.
* Dispatching the *PENDING*, *SUCCESS* and *FAILURE* actions with the necessary
  information.

Any other feature provided by the libraries I made simply didn't scale and only
caused problems in the long term.

This is why I made [Redux ApiMap](https://github.com/sborrazas/redux-apimap) — to
**only** solve the these three problems.

## ApiMap

ApiMap simply maps every action of every endpoint of your API to a Redux action.

This is a quickstart example to get you started:

First, create the API object with all the endpoints and actions for each
endpoint:

<pre class="sh_javascript">
  import { createApi } from 'redux-apimap';

  import store from './store'; // Redux store

  export default createApi(store, {
    users: {
      path: '/users',
      actions: {
        fetch: {
          types: [USERS_FETCH, USERS_FETCH_SUCCESS, USERS_FETCH_FAILURE],
        },
        create: {
          types: [USERS_CREATE, USERS_CREATE_SUCCESS, USERS_CREATE_FAILURE],
          method: 'POST', // Option, submit request with POST
          multipart: true, // Option, submit request as multipart
        }
      }
    }
  }, { json: true, CSRFToken: 'a7136f333552c6d4' });
</pre>

This API object can already dispatch actions and be passed as a prop directly to
any component that might need it. However, in order to make the `api` object
visible throughout the entire React component tree, I recommend you use the
`ApiProvider`, like so:

<pre class="sh_javascript">
  import { ApiProvider } from 'redux-apimap';
  import { Provider } from 'react-redux';

  import api from './api';

  export default class AppWrapper extends React.PureComponent {
    render() {
      return (
        &lt;Provider store={store}&gt;
          &lt;ApiProvider api={api}&gt;
            &lt;App /&gt;
          &lt;/ApiProvider&gt;
        &lt;/ReduxProvider&gt;
      );
    }
  }
</pre>

Then, feel free to dispatch any API action, by using the api object endpoint
methods (actions):

<pre class="sh_javascript">
  const UsersAddButton = ({ api }) => {
    return (
      &lt;button
        onClick={(e) => {
          const name = prompt('Enter user name');
          api.users.create({ name })
            .then(() => alert('User created!'))
            .catch((error) => alert(error));
        }}
      &gt;+ Add new&lt;/button&gt;
    );
  };

  export default connectApi(UsersAddButton);
</pre>

Make sure you add the appropiate reducers to handle the API actions for each
type, and that's all there is to it!
