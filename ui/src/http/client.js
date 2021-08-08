import {fixedEncodeURIComponent} from '@/utils.js';
import store from '@/store'

function request(url, {
  method,
  mode='cors',
  cache='no-cache',
  //credentials='same-origin',
  //redirect='follow',
  //referrerPolicy='strict-origin-when-cross-origin',
  ...others
}) {
  if (others.queryParams) {
    // consume params
    const queryParams = others.queryParams || {};
    const query = Object.entries(queryParams).map(([k, v]) => ([k, fixedEncodeURIComponent(v)].join('='))).join('&');
    if (query) {
      url += '?' + query;
    }
    delete others.queryParams;
  }

  if (others.jsonParams) {
    // consume json
    others.headers ||= {}
    others.headers['Content-Type'] ||= 'application/json'
    others.body = JSON.stringify(others.jsonParams)
    delete others.jsonParams;
  } else if (others.formParams) {
    // consume formParams
    others.headers ||= {}
    others.headers['Content-Type'] ||= 'application/x-www-form-urlencoded';
    const formParams = new URLSearchParams();
    Object.entries(others.formParams).map(([k, v]) => {
      formParams.append(k, v)
    });
    others.body = formParams
    delete others.formParams;
  }
  return new Promise((resolve, reject) => {
    const fixedOptions = {
      method,
      mode,
      cache,
      //credentials,
      //redirect,
      //referrerPolicy,
      ...others
    };
    fetch(url, fixedOptions)
    .then(response => {
      if (!response.ok) {
        if (response.status === 401) {
          const args = arguments;
          store.dispatch('auth/refreshToken')
        }
        response.json()
        .then(err => {
          throw new Error(err);
        })
        .catch(err => {
          throw new Error(err);
        })
      } else {
        resolve(response)
      }
    })
    .catch(err => {
      console.error(err.name, err.message)

    });
  });
}

export default {
  get: async function(url, options={}) {
    return await request(url, {...options, method: 'GET'});
  },
  post: async function (url, options={}) {
    return await request(url, {
      method: 'POST',
      cache: 'no-cache',
      ...options,
    });
  }
};

