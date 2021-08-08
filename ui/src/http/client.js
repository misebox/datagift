import {fixedEncodeURIComponent} from '@/utils.js';

function request(url, {
  method,
  mode='cors',
  cache='no-cache',
  credentials='same-origin',
  redirect='follow',
  referrerPolicy='strict-origin-when-cross-origin',
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
  } else if (others.bodyParams) {
    // consume bodyParams
    others.headers ||= {}
    others.headers['Content-Type'] ||= 'application/x-www-form-urlencoded';
    const bodyParams = new URLSearchParams();
    Object.entries(others.bodyParams).map(([k, v]) => {
      bodyParams.append(k, v)
    });
    others.body = bodyParams
    delete others.bodyParams;
  }
  return new Promise((resolve, reject) => {
    fetch(url, {
      method,
      mode,
      cache,
      credentials,
      redirect,
      referrerPolicy,
      ...others
    })
    .then(response => {
      if (response.ok) {
        resolve(response)
      } else {
        reject(response);
        //response.json()
        //  .then(data => {
        //    const errors = (
        //      data.detail
        //      ? (Array.isArray(data.detail) && (data.detail.length > 0)
        //        ? (typeof data.detail[0] === 'string'
        //          ? data.detail.map(err => ({msg: err}))
        //          : data.detail)
        //        : [{msg: data.detail}])
        //      : [{msg: 'Something wrong'}]
        //    );
        //  })
        //  .catch(() => ([{msg: 'Something wrong'}]));
      }
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

