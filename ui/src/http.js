import config from '@/config'
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
  get: async function(url, params={}, options={}) {
    const query = Object.entries(params).map(([k, v]) => ([k, fixedEncodeURIComponent(v)].join('='))).join('&');
    if (query) {
      url += '?' + query;
    }
    return await request(url, {...options, method: 'GET'});
  },
  post: async function (url, data = {}, options={}) {
    const body = (
      options &&
      options.headers &&
      options.headers['Content-Type'] === 'application/json'
    ) ? JSON.stringify(data)
      : data;
    return await request(url, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      body,
      ...options,
    });
  }
};

